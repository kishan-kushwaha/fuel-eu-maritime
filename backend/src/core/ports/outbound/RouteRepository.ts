import type { Route } from "../../domain/entities/Route.js";

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

export interface RouteRepository {
  findAll(filters?: RouteFilters): Promise<Route[]>;
  findBaseline(): Promise<Route | null>;
  findById(routeId: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
}
