export interface ComparisonResult {
  routeId: string;
  baselineRouteId: string;
  baselineGhgIntensity: number;
  comparisonGhgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}
