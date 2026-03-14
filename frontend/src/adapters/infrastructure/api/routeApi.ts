import type { ComparisonResult } from '../../../core/domain/entities/ComparisonResult';
import type { Route } from '../../../core/domain/entities/Route';
import type { RouteApiPort, RouteFilters } from '../../../core/ports/outbound/RouteApiPort';
import { httpClient } from './httpClient';

export const routeApi: RouteApiPort = {
  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    const params = Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, value]) => value !== undefined && value !== ''),
    );
    const response = await httpClient.get<Route[]>('/routes', { params });
    return response.data;
  },

  async setBaseline(routeId: string) {
    const response = await httpClient.post<{ message: string; routeId: string }>(`/routes/${routeId}/baseline`);
    return response.data;
  },

  async getComparisons(): Promise<ComparisonResult[]> {
    const response = await httpClient.get<ComparisonResult[]>('/routes/comparison');
    return response.data;
  },
};
