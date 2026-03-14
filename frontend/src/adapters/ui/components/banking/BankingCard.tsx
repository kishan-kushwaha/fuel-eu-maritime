import { useState } from 'react';
import type { ComplianceBalance } from '../../../../core/domain/entities/ComplianceBalance';
import { complianceApi } from '../../../infrastructure/api/complianceApi';

type BankingCardProps = {
  balance: ComplianceBalance;
  onActionSuccess: () => Promise<void> | void;
};

export function BankingCard({ balance, onActionSuccess }: BankingCardProps) {
  const [shipId, setShipId] = useState('R004');
  const [amount, setAmount] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cards = [
    { label: 'Current CB', value: balance.currentBalance },
    { label: 'Banked Amount', value: balance.bankedAmount },
    { label: 'Pooled Amount', value: balance.pooledAmount },
    { label: 'Available To Bank', value: balance.availableToBank },
  ];

  const parsedAmount = Number(amount);
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount > 0;

  const canBank = balance.currentBalance > 0 && balance.availableToBank > 0;
  const canApply = balance.bankedAmount > 0;

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

  async function handleBank() {
    try {
      setLoadingAction(true);
      setError('');
      setSuccess('');

      if (!shipId.trim()) {
        setError('Ship ID required hai.');
        return;
      }

      if (!isValidAmount) {
        setError('Valid positive amount dalo.');
        return;
      }

      const result = await complianceApi.bankSurplus({
        shipId: shipId.trim(),
        year: balance.year,
        amount: parsedAmount,
      });

      setSuccess(
        `${result.message} | cb_before: ${result.cb_before.toFixed(2)} | applied: ${result.applied.toFixed(
          2,
        )} | cb_after: ${result.cb_after.toFixed(2)}`,
      );
      setAmount('');
      await onActionSuccess();
    } catch (err) {
      setError(getErrorMessage(err, 'Bank action failed'));
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleApply() {
    try {
      setLoadingAction(true);
      setError('');
      setSuccess('');

      if (!shipId.trim()) {
        setError('Ship ID required hai.');
        return;
      }

      if (!isValidAmount) {
        setError('Valid positive amount dalo.');
        return;
      }

      const result = await complianceApi.applyBankedCredits({
        shipId: shipId.trim(),
        year: balance.year,
        amount: parsedAmount,
      });

      setSuccess(
        `${result.message} | applied: ${result.applied.toFixed(2)} | remaining: ${result.remaining.toFixed(2)}`,
      );
      setAmount('');
      await onActionSuccess();
    } catch (err) {
      setError(getErrorMessage(err, 'Apply action failed'));
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Compliance Year</p>
            <h3 className="text-2xl font-bold">{balance.year}</h3>
          </div>
          <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold uppercase text-white">
            {balance.status}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold">{card.value.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h4 className="text-lg font-semibold text-slate-900">Banking Actions</h4>
        <p className="mt-1 text-sm text-slate-500">
          Yahan se surplus bank ya banked credits apply kar sakte ho.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Ship ID</label>
            <input
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              placeholder="e.g. R004"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              type="number"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 transition focus:border-slate-500"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleBank}
            disabled={loadingAction || !canBank}
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white ${
              loadingAction || !canBank ? 'cursor-not-allowed bg-slate-300' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {loadingAction ? 'Processing...' : 'Bank Surplus'}
          </button>

          <button
            onClick={handleApply}
            disabled={loadingAction || !canApply}
            className={`rounded-xl px-4 py-3 text-sm font-semibold text-white ${
              loadingAction || !canApply ? 'cursor-not-allowed bg-slate-300' : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            {loadingAction ? 'Processing...' : 'Apply Banked Credits'}
          </button>
        </div>

        {!canBank && (
          <p className="mt-3 text-sm text-amber-700">
            Bank Surplus button disabled hai kyunki current CB ya available-to-bank positive nahi hai.
          </p>
        )}

        {!canApply && (
          <p className="mt-2 text-sm text-amber-700">
            Apply button disabled hai kyunki banked amount positive nahi hai.
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        FuelEU Article 20 banking allows surplus compliance balance to be carried forward. This demo shows the
        current balance and available amount that may be banked.
      </div>
    </div>
  );
}