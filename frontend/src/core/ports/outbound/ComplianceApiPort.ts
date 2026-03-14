import type { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import type { Pool } from '../../domain/entities/Pool';

export interface ComplianceApiPort {
  getComplianceBalance(year: number): Promise<ComplianceBalance>;
  getPools(year: number): Promise<Pool[]>;

  bankSurplus(input: {
    shipId: string;
    year: number;
    amount: number;
  }): Promise<{
    message: string;
    shipId: string;
    year: number;
    cb_before: number;
    applied: number;
    cb_after: number;
  }>;

  applyBankedCredits(input: {
    shipId: string;
    year: number;
    amount: number;
  }): Promise<{
    message: string;
    shipId: string;
    year: number;
    applied: number;
    remaining: number;
  }>;

  createPool(input: {
    year: number;
    members: string[];
  }): Promise<{
    message: string;
    poolId: string;
    year: number;
    totalBalance: number;
    members: Array<{
      shipId: string;
      cbBefore: number;
      cbAfter: number;
      balanceContribution: number;
    }>;
  }>;
}