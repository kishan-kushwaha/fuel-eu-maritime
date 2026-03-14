import { useEffect, useState } from 'react';
import { getComparisons } from '../../../core/application/use-cases/getComparisons';
import type { ComparisonResult } from '../../../core/domain/entities/ComparisonResult';
import { routeApi } from '../../infrastructure/api/routeApi';

export function useComparison() {
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComparisons(routeApi);
        setComparisons(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch comparisons');
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  return { comparisons, loading, error };
}
