import type { ComplianceApiPort } from '../../ports/outbound/ComplianceApiPort';

export const getComplianceBalance = (complianceApi: ComplianceApiPort, year: number) => {
  return complianceApi.getComplianceBalance(year);
};
