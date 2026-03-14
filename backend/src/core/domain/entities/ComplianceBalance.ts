export interface ComplianceBalance {
  year: number;
  currentBalance: number;
  bankedAmount: number;
  pooledAmount: number;
  availableToBank: number;
  status: "surplus" | "deficit" | "neutral";
}
