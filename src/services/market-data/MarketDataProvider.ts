import { MarketTick } from '../../types/market';

export interface MarketDataProvider {
  connect(): void;
  disconnect(): void;
  subscribe(symbols: string[]): void;
  unsubscribe(symbols: string[]): void;
  onTick(callback: (ticks: MarketTick[]) => void): () => void;
}
