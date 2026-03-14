import type { Request, Response } from "express";
import { z } from "zod";
import { GetComplianceBalanceUseCase } from "../../../../core/application/use-cases/GetComplianceBalanceUseCase.js";
import { GetPoolsUseCase } from "../../../../core/application/use-cases/GetPoolsUseCase.js";
import { PostgresComplianceRepository } from "../../../outbound/persistence/postgres/repositories/PostgresComplianceRepository.js";

const complianceRepository = new PostgresComplianceRepository();
const getComplianceBalanceUseCase = new GetComplianceBalanceUseCase(complianceRepository);
const getPoolsUseCase = new GetPoolsUseCase(complianceRepository);

const yearQuerySchema = z.object({
  year: z.coerce.number(),
});

export class ComplianceController {
  async getComplianceBalance(request: Request, response: Response) {
    try {
      const { year } = yearQuerySchema.parse(request.query);
      const balance = await getComplianceBalanceUseCase.execute(year);
      response.json(balance);
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to fetch compliance balance",
      });
    }
  }

  async getPools(request: Request, response: Response) {
    try {
      const { year } = yearQuerySchema.parse(request.query);
      const pools = await getPoolsUseCase.execute(year);
      response.json(pools);
    } catch (error) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to fetch pools",
      });
    }
  }
}
