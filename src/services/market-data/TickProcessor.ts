import { MarketTick } from '../../types/market';
import { useMarketStore } from '../../store/marketStore';

export class TickProcessor {
  start() {
    // No-op for compatibility
  }
  
  stop() {
    // No-op for compatibility
  }
  
  processTicks(ticks: MarketTick[]) {
    if (ticks.length === 0) return;
    
    const updates: Record<string, MarketTick> = {};
    for (const tick of ticks) {
      updates[tick.symbol] = tick;
    }
    
    // Commit immediately since HTTP polling is naturally batched and sequential
    useMarketStore.getState().updatePrices(updates);
  }
}
