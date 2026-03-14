import type { Request, Response } from "express";
import { z } from "zod";
// import { pool } from "../../outbound/persistence/db.js";
import { pool } from "../../../outbound/persistence/postgres/db.js";

const bankSchema = z.object({
  shipId: z.string().min(1),
  year: z.coerce.number(),
  amount: z.coerce.number().positive(),
});

export class BankingController {
  async bankSurplus(request: Request, response: Response) {
    try {
      const { shipId, year, amount } = bankSchema.parse(request.body);

      const complianceResult = await pool.query(
        `
        SELECT cb_gco2eq
        FROM ship_compliance
        WHERE ship_id = $1 AND year = $2
        LIMIT 1
        `,
        [shipId, year],
      );

      if (complianceResult.rowCount === 0) {
        return response.status(404).json({
          message: `No ship compliance record found for ${shipId} in year ${year}`,
        });
      }

      const currentBalance = Number(complianceResult.rows[0].cb_gco2eq);

      if (currentBalance <= 0) {
        return response.status(400).json({
          message: "Cannot bank surplus because compliance balance is not positive",
        });
      }

      const bankedResult = await pool.query(
        `
        SELECT COALESCE(SUM(amount_gco2eq), 0) AS total_banked
        FROM bank_entries
        WHERE ship_id = $1 AND year = $2 AND entry_type = 'banked'
        `,
        [shipId, year],
      );

      const totalBanked = Number(bankedResult.rows[0].total_banked);
      const availableToBank = currentBalance - totalBanked;

      if (amount > availableToBank) {
        return response.status(400).json({
          message: `Requested amount exceeds available surplus. Available to bank: ${availableToBank}`,
        });
      }

      await pool.query(
        `
        INSERT INTO bank_entries (ship_id, year, amount_gco2eq, entry_type)
        VALUES ($1, $2, $3, 'banked')
        `,
        [shipId, year, amount],
      );

      return response.status(201).json({
        message: "Surplus banked successfully",
        shipId,
        year,
        cb_before: currentBalance,
        applied: amount,
        cb_after: currentBalance - amount,
      });
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to bank surplus",
      });
    }
  }


  async applyBankedCredits(request: Request, response: Response) {
  try {
    const { shipId, year, amount } = bankSchema.parse(request.body);

    const bankedResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount_gco2eq),0) AS total_banked
      FROM bank_entries
      WHERE ship_id = $1 AND year = $2 AND entry_type = 'banked'
      `,
      [shipId, year]
    );

    const appliedResult = await pool.query(
      `
      SELECT COALESCE(SUM(amount_gco2eq),0) AS total_applied
      FROM bank_entries
      WHERE ship_id = $1 AND year = $2 AND entry_type = 'applied'
      `,
      [shipId, year]
    );

    const totalBanked = Number(bankedResult.rows[0].total_banked);
    const totalApplied = Number(appliedResult.rows[0].total_applied);

    const available = totalBanked - totalApplied;

    if (amount > available) {
      return response.status(400).json({
        message: `Not enough banked credits. Available: ${available}`,
      });
    }

    await pool.query(
      `
      INSERT INTO bank_entries (ship_id, year, amount_gco2eq, entry_type)
      VALUES ($1,$2,$3,'applied')
      `,
      [shipId, year, amount]
    );

    return response.status(201).json({
      message: "Banked credits applied successfully",
      shipId,
      year,
      applied: amount,
      remaining: available - amount,
    });
  } catch (error) {
    return response.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to apply banked credits",
    });
  }
}

  async getBankingRecords(request: Request, response: Response) {
    try {
      const querySchema = z.object({
        shipId: z.string().min(1),
        year: z.coerce.number(),
      });

      const { shipId, year } = querySchema.parse(request.query);

      const result = await pool.query(
        `
        SELECT id, ship_id, year, amount_gco2eq, entry_type, created_at
        FROM bank_entries
        WHERE ship_id = $1 AND year = $2
        ORDER BY id ASC
        `,
        [shipId, year],
      );

      return response.json(result.rows);
    } catch (error) {
      return response.status(400).json({
        message: error instanceof Error ? error.message : "Failed to fetch banking records",
      });
    }
  }
}