export type PoolMember = {
  routeId: string;
  balanceContribution: number;
  cbBefore: number;
  cbAfter: number;
};

export type Pool = {
  poolId: string;
  year: number;
  totalBalance: number;
  members: PoolMember[];
};