export type MarketTick = {
  symbol: string;
  ltp: number;
  prevClose: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  timeStamp?: string;
};

export type MarketState = {
  prices: Record<string, MarketTick>;
  updatePrices: (updates: Record<string, MarketTick>) => void;
};
