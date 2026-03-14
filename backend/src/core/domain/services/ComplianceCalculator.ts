import type { ComparisonResult } from "../entities/ComparisonResult.js";
import type { Route } from "../entities/Route.js";

export const TARGET_GHG_INTENSITY = 89.3368;

export class ComplianceCalculator {
  static calculatePercentDiff(baseline: number, comparison: number): number {
    if (baseline === 0) return 0;
    return Number((((comparison / baseline) - 1) * 100).toFixed(2));
  }

  static isCompliant(ghgIntensity: number): boolean {
    return ghgIntensity <= TARGET_GHG_INTENSITY;
  }

  static buildComparison(baselineRoute: Route, comparisonRoute: Route): ComparisonResult {
    return {
      routeId: comparisonRoute.routeId,
      baselineRouteId: baselineRoute.routeId,
      baselineGhgIntensity: baselineRoute.ghgIntensity,
      comparisonGhgIntensity: comparisonRoute.ghgIntensity,
      percentDiff: this.calculatePercentDiff(
        baselineRoute.ghgIntensity,
        comparisonRoute.ghgIntensity,
      ),
      compliant: this.isCompliant(comparisonRoute.ghgIntensity),
    };
  }
}
