import { useEffect, useState } from 'react';
import { getPools } from '../../../core/application/use-cases/getPools';
import type { Pool } from '../../../core/domain/entities/Pool';
import { complianceApi } from '../../infrastructure/api/complianceApi';

export function usePools(year: number) {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPools(complianceApi, year);
        setPools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pools');
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [year]);

  return { pools, loading, error };
}
