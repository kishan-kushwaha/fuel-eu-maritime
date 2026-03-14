import type { Route } from '../../../../core/domain/entities/Route';

interface RoutesTableProps {
  routes: Route[];
  onSetBaseline: (routeId: string) => Promise<void>;
}

export function RoutesTable({ routes, onSetBaseline }: RoutesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              {[
                'routeId',
                'vesselType',
                'fuelType',
                'year',
                'ghgIntensity',
                'fuelConsumption',
                'distance',
                'totalEmissions',
                'action',
              ].map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.routeId} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium">{route.routeId}</td>
                <td className="px-4 py-3">{route.vesselType}</td>
                <td className="px-4 py-3">{route.fuelType}</td>
                <td className="px-4 py-3">{route.year}</td>
                <td className="px-4 py-3">{route.ghgIntensity.toFixed(4)}</td>
                <td className="px-4 py-3">{route.fuelConsumption.toFixed(2)} t</td>
                <td className="px-4 py-3">{route.distance.toFixed(2)} km</td>
                <td className="px-4 py-3">{route.totalEmissions.toFixed(2)} t</td>
                <td className="px-4 py-3">
                  {route.isBaseline ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Baseline
                    </span>
                  ) : (
                    <button
                      onClick={() => void onSetBaseline(route.routeId)}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      Set Baseline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
