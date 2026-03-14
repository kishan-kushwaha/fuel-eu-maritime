import type { ComparisonResult } from '../../../../core/domain/entities/ComparisonResult';

export function CompareTable({ comparisons }: { comparisons: ComparisonResult[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Route</th>
              <th className="px-4 py-3 font-semibold">Baseline GHG</th>
              <th className="px-4 py-3 font-semibold">Comparison GHG</th>
              <th className="px-4 py-3 font-semibold">% Difference</th>
              <th className="px-4 py-3 font-semibold">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((comparison) => (
              <tr key={comparison.routeId} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium">{comparison.routeId}</td>
                <td className="px-4 py-3">{comparison.baselineGhgIntensity.toFixed(4)}</td>
                <td className="px-4 py-3">{comparison.comparisonGhgIntensity.toFixed(4)}</td>
                <td className="px-4 py-3">{comparison.percentDiff.toFixed(2)}%</td>
                <td className="px-4 py-3 text-xl">{comparison.compliant ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
