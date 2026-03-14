import type { ComparisonResult } from '../../domain/entities/ComparisonResult';
import type { Route } from '../../domain/entities/Route';

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: string;
}

export interface RouteApiPort {
  getRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<{ message: string; routeId: string }>;
  getComparisons(): Promise<ComparisonResult[]>;
}
