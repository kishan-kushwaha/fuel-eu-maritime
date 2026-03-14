import type { ComplianceBalance } from "../../../../../core/domain/entities/ComplianceBalance.js";
import type { Pool } from "../../../../../core/domain/entities/Pool.js";
import type { ComplianceRepository } from "../../../../../core/ports/outbound/ComplianceRepository.js";
import { pool } from "../db.js";

export class PostgresComplianceRepository implements ComplianceRepository {
  async getComplianceBalanceByYear(year: number): Promise<ComplianceBalance | null> {
    const complianceResult = await pool.query(
      `
      SELECT COALESCE(SUM(cb_gco2eq), 0) AS current_balance
      FROM ship_compliance
      WHERE year = $1
      `,
      [year],
    );

    const bankedResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount_gco2eq), 0) AS banked_amount
      FROM bank_entries
      WHERE year = $1 AND entry_type = 'banked'
      `,
      [year],
    );

    const pooledResult = await pool.query(
      `
      SELECT COALESCE(SUM(cb_before - cb_after), 0) AS pooled_amount
      FROM pool_members pm
      JOIN pools p ON p.id = pm.pool_id
      WHERE p.year = $1
      `,
      [year],
    );

    const currentBalance = Number(complianceResult.rows[0]?.current_balance ?? 0);
    const bankedAmount = Number(bankedResult.rows[0]?.banked_amount ?? 0);
    const pooledAmount = Number(pooledResult.rows[0]?.pooled_amount ?? 0);

    const hasAnyData =
      currentBalance !== 0 || bankedAmount !== 0 || pooledAmount !== 0;

    if (!hasAnyData) {
      return null;
    }

    const availableToBank = currentBalance > 0 ? currentBalance - bankedAmount : 0;
    const status =
      currentBalance > 0 ? "surplus" : currentBalance < 0 ? "deficit" : "neutral";

    return {
      year,
      currentBalance,
      bankedAmount,
      pooledAmount,
      availableToBank,
      status,
    } as ComplianceBalance;
  }

 async getPoolsByYear(year: number): Promise<Pool[]> {
  const poolsResult = await pool.query(
    `
    SELECT id, year
    FROM pools
    WHERE year = $1
    ORDER BY id ASC
    `,
    [year],
  );

  const membersResult = await pool.query(
    `
    SELECT
      pm.pool_id,
      pm.ship_id,
      pm.cb_before,
      pm.cb_after
    FROM pool_members pm
    JOIN pools p ON p.id = pm.pool_id
    WHERE p.year = $1
    ORDER BY pm.pool_id, pm.ship_id
    `,
    [year],
  );

  const membersByPool = new Map<
    number,
    Array<{
      routeId: string;
      balanceContribution: number;
      cbBefore: number;
      cbAfter: number;
    }>
  >();

  for (const member of membersResult.rows) {
    const poolId = Number(member.pool_id);
    const cbBefore = Number(member.cb_before);
    const cbAfter = Number(member.cb_after);
    const current = membersByPool.get(poolId) ?? [];

    current.push({
      routeId: String(member.ship_id),
      balanceContribution: cbAfter - cbBefore,
      cbBefore,
      cbAfter,
    });

    membersByPool.set(poolId, current);
  }

  return poolsResult.rows.map((row: { id: number; year: number }) => {
    const poolId = Number(row.id);
    const members = membersByPool.get(poolId) ?? [];
    const totalBalance = members.reduce(
      (sum, member) => sum + member.cbAfter,
      0,
    );

    return {
      poolId: `POOL-${row.year}-${poolId}`,
      year: Number(row.year),
      totalBalance,
      members,
    };
  });
}
}