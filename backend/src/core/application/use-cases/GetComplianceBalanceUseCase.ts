import type { ComplianceRepository } from "../../ports/outbound/ComplianceRepository.js";

export class GetComplianceBalanceUseCase {
  constructor(private readonly complianceRepository: ComplianceRepository) {}

  async execute(year: number) {
    const balance = await this.complianceRepository.getComplianceBalanceByYear(year);
    if (!balance) {
      throw new Error(`No compliance balance found for year ${year}`);
    }

    return balance;
  }
}
