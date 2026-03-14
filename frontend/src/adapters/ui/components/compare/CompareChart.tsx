import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ComparisonResult } from '../../../../core/domain/entities/ComparisonResult';

export function CompareChart({ comparisons }: { comparisons: ComparisonResult[] }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-4 text-base font-semibold">GHG Intensity Comparison</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisons}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="routeId" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="baselineGhgIntensity" name="Baseline GHG" fill="#0f172a" radius={[6, 6, 0, 0]} />
            <Bar dataKey="comparisonGhgIntensity" name="Comparison GHG" fill="#64748b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
