import { useCallback, useEffect, useState } from 'react';
import { BankingCard } from '../components/banking/BankingCard';
import { complianceApi } from '../../infrastructure/api/complianceApi';
import type { ComplianceBalance } from '../../../core/domain/entities/ComplianceBalance';

export function BankingPage() {
  const [balance, setBalance] = useState<ComplianceBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await complianceApi.getComplianceBalance(2025);
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load banking data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  if (loading) {
    return <div className="rounded-2xl bg-white p-6">Loading banking data...</div>;
  }

  if (error) {
    return <div className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>;
  }

  if (!balance) return null;

  return <BankingCard balance={balance} onActionSuccess={loadBalance} />;
}