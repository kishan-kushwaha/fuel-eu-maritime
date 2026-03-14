import type { ReactNode } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            FuelEU Maritime
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compliance Dashboard</h1>
          <p className="max-w-3xl text-sm text-slate-600">
            Minimal hexagonal full-stack implementation for route tracking, baseline comparison,
            banking, and pooling.
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
