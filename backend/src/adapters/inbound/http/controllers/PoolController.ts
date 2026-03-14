import type { Request, Response } from "express";
import { z } from "zod";
import { pool } from "../../../outbound/persistence/postgres/db.js";

const createPoolSchema = z.object({
  year: z.coerce.number(),
  members: z.array(z.string().min(1)).min(2),
});

type ComplianceRow = {
  ship_id: string;
  cb_gco2eq: string | number;
};

export class PoolController {
  async createPool(request: Request, response: Response) {
    const client = await pool.connect();

    try {
      const { year, members } = createPoolSchema.parse(request.body);

      const complianceResult = await client.query(
        `
        SELECT ship_id, cb_gco2eq
        FROM ship_compliance
        WHERE year = $1
          AND ship_id = ANY($2::varchar[])
        ORDER BY ship_id ASC
        `,
        [year, members],
      );

      if (complianceResult.rowCount !== members.length) {
        return response.status(400).json({
          message: "One or more members do not have compliance records for the given year",
        });
      }

      const rows = complianceResult.rows as ComplianceRow[];

      const normalizedRows = rows.map((row) => ({
        shipId: row.ship_id,
        cbBefore: Number(row.cb_gco2eq),
      }));

      const totalBalance = normalizedRows.reduce((sum, row) => sum + row.cbBefore, 0);

      if (totalBalance < 0) {
        return response.status(400).json({
          message: "Invalid pool: total adjusted CB must be >= 0",
          totalBalance,
        });
      }

      await client.query("BEGIN");

      const poolInsert = await client.query(
        `
        INSERT INTO pools (year)
        VALUES ($1)
        RETURNING id, year
        `,
        [year],
      );

      const poolId = Number(poolInsert.rows[0].id);

      // Total deficit kitna hai
      let remainingDeficit = normalizedRows
        .filter((row) => row.cbBefore < 0)
        .reduce((sum, row) => sum + Math.abs(row.cbBefore), 0);

      const insertedMembers: Array<{
        shipId: string;
        cb_before: number;
        cb_after: number;
      }> = [];

      for (const row of normalizedRows) {
        const before = row.cbBefore;
        let after = before;

        if (before < 0) {
          // Total pool valid hai, to deficit ships ko 0 tak bring kar सकते हैं
          after = 0;
        } else if (before > 0) {
          // Positive ship utna hi contribute kare jitna deficit cover karna hai
          const contribution = Math.min(before, remainingDeficit);
          after = before - contribution;
          remainingDeficit -= contribution;
        }

        await client.query(
          `
          INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
          VALUES ($1, $2, $3, $4)
          `,
          [poolId, row.shipId, before, after],
        );

        insertedMembers.push({
          shipId: row.shipId,
          cb_before: before,
          cb_after: after,
        });
      }

      await client.query("COMMIT");

      return response.status(201).json({
        message: "Pool created successfully",
        poolId: `POOL-${year}-${poolId}`,
        year,
        totalBalance,
        members: insertedMembers,
      });
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      return response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to create pool",
      });
    } finally {
      client.release();
    }
  }
}