import BigNumber from "bignumber.js";

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface Ybt {
  baseToken: Token;
  syToken: Token;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface PoolInfo {
  ybt: Ybt | undefined;
  ybtExchangeRate: BigNumber | undefined;
  amountCollateral: string;
  amountCycle: BigNumber;
  cycleDuration: string;
  cycleDurationUnit?: string;
  totalCycles: string;
  startInterval: string;
  startIntervalUnit?: string;
  cycleDepositAndBidDuration: string;
  cycleDepositAndBidDurationUnit?: string;
}

export interface LowestBid {
  positionId: number;
  amount: BigNumber;
}

export interface Cycle {
  count: number;
  startTime: number;
  endTime: number;
  depositAndBidEndTime: number;
}

export interface SpiralYield {
  amountBase: BigNumber;
  amountYbt: BigNumber;
}

export interface Position {
  id: number;
  owner: string;
  amountCollateral: BigNumber;
  winningCycle: number;
  spiralYield: SpiralYield;
  cyclesDeposited: boolean[];
}
