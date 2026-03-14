import type { RouteApiPort, RouteFilters } from '../../ports/outbound/RouteApiPort';

export const getRoutes = (routeApi: RouteApiPort, filters?: RouteFilters) => {
  return routeApi.getRoutes(filters);
};
