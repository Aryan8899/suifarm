export interface Pool {
  id: number;
  token0: string;
  token1: string;
  network: string;
  version: string;
  feeTier: string;
  apr: {
    current: number;
    previous: number;
  };
  tvl: number;
  volume24h: number;
  poolType: string;
}

export interface Transaction {
  type: string;
  value: string;
  tokens: string;
  account: string;
  time: string;
  category: string;
}

export interface GraphData {
  date: string;
  value: number;
}
