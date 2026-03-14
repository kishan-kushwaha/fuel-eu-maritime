import type { RouteRepository } from "../../ports/outbound/RouteRepository.js";

export class SetBaselineUseCase {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(routeId: string) {
    const route = await this.routeRepository.findById(routeId);
    if (!route) {
      throw new Error(`Route with id ${routeId} not found`);
    }

    await this.routeRepository.setBaseline(routeId);
    return { message: "Baseline set successfully", routeId };
  }
}
