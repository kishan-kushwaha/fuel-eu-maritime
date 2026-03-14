import type { RouteFilters } from '../../../../core/ports/outbound/RouteApiPort';

interface RouteFiltersProps {
  filters: RouteFilters;
  onChange: (filters: RouteFilters) => void;
}

export function RouteFilters({ filters, onChange }: RouteFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
      <input
        value={filters.vesselType ?? ''}
        onChange={(e) => onChange({ ...filters, vesselType: e.target.value })}
        placeholder="Filter by vessel type"
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
      />
      <input
        value={filters.fuelType ?? ''}
        onChange={(e) => onChange({ ...filters, fuelType: e.target.value })}
        placeholder="Filter by fuel type"
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
      />
      <input
        value={filters.year ?? ''}
        onChange={(e) => onChange({ ...filters, year: e.target.value })}
        placeholder="Filter by year"
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
      />
    </div>
  );
}
