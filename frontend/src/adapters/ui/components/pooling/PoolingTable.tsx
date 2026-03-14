import type { Pool } from "../../../../core/domain/entities/Pool";

export function PoolingTable({ pools }: { pools: Pool[] }) {
  return (
    <div className="space-y-4">
      {pools.map((pool) => (
        <div
          key={pool.poolId}
          className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
        >
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{pool.poolId}</h3>
                <p className="text-sm text-slate-500">Year {pool.year}</p>
              </div>

              <div
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  pool.totalBalance >= 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                Total Balance: {pool.totalBalance.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="px-4 py-3 font-semibold">Member Route</th>
                  <th className="px-4 py-3 font-semibold">Before CB</th>
                  <th className="px-4 py-3 font-semibold">After CB</th>
                  <th className="px-4 py-3 font-semibold">Contribution</th>
                </tr>
              </thead>

              <tbody>
                {pool.members.map((member) => (
                  <tr key={member.routeId} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {member.routeId}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {member.cbBefore.toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {member.cbAfter.toFixed(2)}
                    </td>

                    <td
                      className={`px-4 py-3 font-semibold ${
                        member.balanceContribution >= 0
                          ? "text-emerald-700"
                          : "text-rose-700"
                      }`}
                    >
                      {member.balanceContribution.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}