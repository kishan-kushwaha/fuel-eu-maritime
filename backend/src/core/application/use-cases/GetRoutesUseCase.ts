import type { RouteRepository, RouteFilters } from "../../ports/outbound/RouteRepository.js";

export class GetRoutesUseCase {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(filters?: RouteFilters) {
    return this.routeRepository.findAll(filters);
  }
}
