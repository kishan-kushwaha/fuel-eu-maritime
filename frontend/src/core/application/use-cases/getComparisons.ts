import type { RouteApiPort } from '../../ports/outbound/RouteApiPort';

export const getComparisons = (routeApi: RouteApiPort) => {
  return routeApi.getComparisons();
};
