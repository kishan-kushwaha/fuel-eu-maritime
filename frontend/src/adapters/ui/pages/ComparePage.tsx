import { CompareChart } from '../components/compare/CompareChart';
import { CompareTable } from '../components/compare/CompareTable';
import { useComparison } from '../hooks/useComparison';

export function ComparePage() {
  const { comparisons, loading, error } = useComparison();

  if (loading) return <div className="rounded-2xl bg-white p-6">Loading comparisons...</div>;
  if (error) return <div className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">
        Comparison target: <strong>89.3368 gCO₂e/MJ</strong>. Percent difference formula:
        <code className="ml-2 rounded bg-white px-2 py-1">((comparison / baseline) - 1) × 100</code>
      </div>
      <CompareTable comparisons={comparisons} />
      <CompareChart comparisons={comparisons} />
    </div>
  );
}
