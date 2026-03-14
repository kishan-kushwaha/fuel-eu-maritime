import type { ComplianceApiPort } from '../../ports/outbound/ComplianceApiPort';

export const getPools = (complianceApi: ComplianceApiPort, year: number) => {
  return complianceApi.getPools(year);
};
