import type { ComplianceRepository } from "../../ports/outbound/ComplianceRepository.js";

export class GetPoolsUseCase {
  constructor(private readonly complianceRepository: ComplianceRepository) {}

  async execute(year: number) {
    return this.complianceRepository.getPoolsByYear(year);
  }
}
