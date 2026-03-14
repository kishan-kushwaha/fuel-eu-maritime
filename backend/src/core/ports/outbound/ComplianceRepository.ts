import type { ComplianceBalance } from "../../domain/entities/ComplianceBalance.js";
import type { Pool } from "../../domain/entities/Pool.js";

export interface ComplianceRepository {
  getComplianceBalanceByYear(year: number): Promise<ComplianceBalance | null>;
  getPoolsByYear(year: number): Promise<Pool[]>;
}
