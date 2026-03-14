import type { Route } from "../../../../../core/domain/entities/Route.js";
import type {
  RouteFilters,
  RouteRepository,
} from "../../../../../core/ports/outbound/RouteRepository.js";
import { pool } from "../db.js";

const toRoute = (row: Record<string, unknown>): Route => ({
  routeId: String(row.route_id),
  vesselType: String(row.vessel_type),
  fuelType: String(row.fuel_type),
  year: Number(row.year),
  ghgIntensity: Number(row.ghg_intensity),
  fuelConsumption: Number(row.fuel_consumption),
  distance: Number(row.distance),
  totalEmissions: Number(row.total_emissions),
  isBaseline: Boolean(row.is_baseline),
});

export class PostgresRouteRepository implements RouteRepository {
  async findAll(filters?: RouteFilters): Promise<Route[]> {
    const values: Array<string | number> = [];
    const conditions: string[] = [];

    if (filters?.vesselType) {
      values.push(filters.vesselType);
      conditions.push(`vessel_type = $${values.length}`);
    }
    if (filters?.fuelType) {
      values.push(filters.fuelType);
      conditions.push(`fuel_type = $${values.length}`);
    }
    if (filters?.year) {
      values.push(filters.year);
      conditions.push(`year = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT * FROM routes ${whereClause} ORDER BY year DESC, route_id ASC`,
      values,
    );

    return result.rows.map(toRoute);
  }

  async findBaseline(): Promise<Route | null> {
    const result = await pool.query(
      `SELECT * FROM routes WHERE is_baseline = true LIMIT 1`,
    );

    if (result.rowCount === 0) return null;
    return toRoute(result.rows[0]);
  }

  async findById(routeId: string): Promise<Route | null> {
    const result = await pool.query(`SELECT * FROM routes WHERE route_id = $1 LIMIT 1`, [routeId]);
    if (result.rowCount === 0) return null;
    return toRoute(result.rows[0]);
  }

  async setBaseline(routeId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`UPDATE routes SET is_baseline = false WHERE is_baseline = true`);
      await client.query(`UPDATE routes SET is_baseline = true WHERE route_id = $1`, [routeId]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
