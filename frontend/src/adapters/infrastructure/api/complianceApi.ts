import type { ComplianceBalance } from '../../../core/domain/entities/ComplianceBalance';
import type { Pool } from '../../../core/domain/entities/Pool';
import type { ComplianceApiPort } from '../../../core/ports/outbound/ComplianceApiPort';
import { httpClient } from './httpClient';

export const complianceApi: ComplianceApiPort = {
  async getComplianceBalance(year: number): Promise<ComplianceBalance> {
    const response = await httpClient.get<ComplianceBalance>('/compliance/cb', {
      params: { year },
    });
    return response.data;
  },

  async getPools(year: number): Promise<Pool[]> {
    const response = await httpClient.get<Pool[]>('/compliance/adjusted-cb', {
      params: { year },
    });
    return response.data;
  },

  async bankSurplus(input: {
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
  }> {
    const response = await httpClient.post('/banking/bank', input);
    return response.data;
  },

  async applyBankedCredits(input: {
    shipId: string;
    year: number;
    amount: number;
  }): Promise<{
    message: string;
    shipId: string;
    year: number;
    applied: number;
    remaining: number;
  }> {
    const response = await httpClient.post('/banking/apply', input);
    return response.data;
  },

  async createPool(input: {
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
  }> {
    const response = await httpClient.post('/pools', input);
    return response.data;
  },
};