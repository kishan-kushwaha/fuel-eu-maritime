import { useEffect, useState } from 'react';
import { getComplianceBalance } from '../../../core/application/use-cases/getComplianceBalance';
import type { ComplianceBalance } from '../../../core/domain/entities/ComplianceBalance';
import { complianceApi } from '../../infrastructure/api/complianceApi';

export function useComplianceBalance(year: number) {
  const [balance, setBalance] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getComplianceBalance(complianceApi, year);
        setBalance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch compliance balance');
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [year]);

  return { balance, loading, error };
}
