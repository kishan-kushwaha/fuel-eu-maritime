import type { Request, Response } from "express";
import { z } from "zod";
import { GetRouteComparisonUseCase } from "../../../../core/application/use-cases/GetRouteComparisonUseCase.js";
import { GetRoutesUseCase } from "../../../../core/application/use-cases/GetRoutesUseCase.js";
import { SetBaselineUseCase } from "../../../../core/application/use-cases/SetBaselineUseCase.js";
import { PostgresRouteRepository } from "../../../outbound/persistence/postgres/repositories/PostgresRouteRepository.js";

const routeRepository = new PostgresRouteRepository();
const getRoutesUseCase = new GetRoutesUseCase(routeRepository);
const setBaselineUseCase = new SetBaselineUseCase(routeRepository);
const getRouteComparisonUseCase = new GetRouteComparisonUseCase(routeRepository);

const routeFilterSchema = z.object({
  vesselType: z.string().optional(),
  fuelType: z.string().optional(),
  year: z.coerce.number().optional(),
});

export class RouteController {
  async getRoutes(request: Request, response: Response) {
    try {
      const filters = routeFilterSchema.parse(request.query);
      const routes = await getRoutesUseCase.execute(filters);
      response.json(routes);
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to fetch routes",
      });
    }
  }

  async setBaseline(request: Request, response: Response) {
    try {
      const { routeId } = request.params;
      const result = await setBaselineUseCase.execute(routeId);
      response.json(result);
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to set baseline",
      });
    }
  }

  async getComparisons(_request: Request, response: Response) {
    try {
      const comparisons = await getRouteComparisonUseCase.execute();
      response.json(comparisons);
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to fetch route comparisons",
      });
    }
  }
}
