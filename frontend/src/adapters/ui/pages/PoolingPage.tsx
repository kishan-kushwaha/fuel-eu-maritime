import { useCallback, useEffect, useState } from 'react';
import { PoolingTable } from '../components/pooling/PoolingTable';
import { complianceApi } from '../../infrastructure/api/complianceApi';
import type { Pool } from '../../../core/domain/entities/Pool';

export function PoolingPage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ship1, setShip1] = useState('R004');
  const [ship2, setShip2] = useState('R005');
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadPools = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await complianceApi.getPools(selectedYear);
      setPools(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pooling data');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    loadPools();
  }, [loadPools]);

  const selectedMembers = [ship1.trim(), ship2.trim()].filter(Boolean);
  const isDuplicate = selectedMembers.length !== new Set(selectedMembers).size;
  const isValid = selectedMembers.length >= 2 && !isDuplicate;

  function getErrorMessage(err: unknown, fallback: string) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: unknown }).response === 'object' &&
      (err as { response?: { data?: unknown } }).response?.data &&
      typeof (err as { response?: { data?: { message?: unknown } } }).response?.data === 'object'
    ) {
      const message = (err as { response?: { data?: { message?: unknown } } }).response?.data?.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    if (err instanceof Error && err.message.trim()) {
      return err.message;
    }

    return fallback;
  }

  async function handleCreatePool() {
    try {
      setSubmitting(true);
      setError('');
      setActionMessage('');

      if (!isValid) {
        setError('Create Pool tabhi enabled hoga jab 2 alag members hon.');
        return;
      }

      const result = await complianceApi.createPool({
        year: selectedYear,
        members: selectedMembers,
      });

      setActionMessage(
        `${result.message} | poolId: ${result.poolId} | totalBalance: ${result.totalBalance.toFixed(2)}`,
      );

      await loadPools();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create pool'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="rounded-2xl bg-white p-6">Loading pooling data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
        Pooling aggregates compliance balances across multiple routes. A positive total balance can offset a route deficit within the same pool.
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Compliance Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Member 1</label>
            <input
              value={ship1}
              onChange={(e) => setShip1(e.target.value.toUpperCase())}
              placeholder="e.g. R004"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Member 2</label>
            <input
              value={ship2}
              onChange={(e) => setShip2(e.target.value.toUpperCase())}
              placeholder="e.g. R005"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleCreatePool}
            disabled={submitting || !isValid}
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white ${
              submitting || !isValid ? 'cursor-not-allowed bg-slate-300' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {submitting ? 'Creating...' : 'Create Pool'}
          </button>
        </div>

        {!isValid && (
          <p className="mt-3 text-sm text-amber-700">
            Create Pool disabled hai. 2 alag member route IDs dene honge.
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {actionMessage && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {actionMessage}
          </div>
        )}
      </div>

      {pools.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm ring-1 ring-slate-200">
          No pooling data found for {selectedYear}.
        </div>
      ) : (
        <PoolingTable pools={pools} />
      )}
    </div>
  );
}