import { ComplianceCalculator } from "../../domain/services/ComplianceCalculator.js";
import type { RouteRepository } from "../../ports/outbound/RouteRepository.js";

export class GetRouteComparisonUseCase {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute() {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error("No baseline route is set. Please set a baseline first.");
    }

    const routes = await this.routeRepository.findAll();

    return routes
      .filter((route) => route.routeId !== baseline.routeId)
      .map((route) => ComplianceCalculator.buildComparison(baseline, route));
  }
}
