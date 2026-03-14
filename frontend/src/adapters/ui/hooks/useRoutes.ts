import { useCallback, useEffect, useState } from 'react';
import { getRoutes } from '../../../core/application/use-cases/getRoutes';
import { setBaseline } from '../../../core/application/use-cases/setBaseline';
import type { Route } from '../../../core/domain/entities/Route';
import type { RouteFilters } from '../../../core/ports/outbound/RouteApiPort';
import { routeApi } from '../../infrastructure/api/routeApi';

export function useRoutes(filters: RouteFilters) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoutes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoutes(routeApi, filters);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSetBaseline = useCallback(async (routeId: string) => {
    await setBaseline(routeApi, routeId);
    await loadRoutes();
  }, [loadRoutes]);

  useEffect(() => {
    void loadRoutes();
  }, [loadRoutes]);

  return { routes, loading, error, refetch: loadRoutes, setBaseline: handleSetBaseline };
}
