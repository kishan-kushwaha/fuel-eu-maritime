import { useMemo, useState } from 'react';
import type { RouteFilters as FilterValues } from '../../../core/ports/outbound/RouteApiPort';
import { RouteFilters } from '../components/routes/RouteFilters';
import { RoutesTable } from '../components/routes/RoutesTable';
import { useRoutes } from '../hooks/useRoutes';

export function RoutesPage() {
  const [filters, setFilters] = useState<FilterValues>({});
  const normalizedFilters = useMemo(() => filters, [filters]);
  const { routes, loading, error, setBaseline } = useRoutes(normalizedFilters);

  return (
    <div className="space-y-4">
      <RouteFilters filters={filters} onChange={setFilters} />
      {loading ? <div className="rounded-2xl bg-white p-6">Loading routes...</div> : null}
      {error ? <div className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</div> : null}
      {!loading && !error ? <RoutesTable routes={routes} onSetBaseline={setBaseline} /> : null}
    </div>
  );
}
