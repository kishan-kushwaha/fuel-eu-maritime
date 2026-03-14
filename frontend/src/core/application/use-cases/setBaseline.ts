import type { RouteApiPort } from '../../ports/outbound/RouteApiPort';

export const setBaseline = (routeApi: RouteApiPort, routeId: string) => {
  return routeApi.setBaseline(routeId);
};
