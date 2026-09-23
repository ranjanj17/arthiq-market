import { MarketTick } from '../../types/market';
import { useMarketStore } from '../../store/marketStore';

/**
 * The TickProcessor acts as the "Inbox" for all incoming live prices.
 * Every time the Polling API gets new prices from the server, it hands them to this processor.
 */
export class TickProcessor {
  start() {
    // No-op for compatibility
  }
  
  stop() {
    // No-op for compatibility
  }
  
  /**
   * Takes the raw array of price ticks from the server and safely updates the app state.
   */
  processTicks(ticks: MarketTick[]) {
    // If the server sent us nothing, just ignore it.
    if (ticks.length === 0) return;
    
    // Step 1: Create a single temporary "dictionary" (object) of all the new prices.
    // Example: { "RELIANCE": { ltp: 2950 }, "TCS": { ltp: 3800 } }
    const updates: Record<string, MarketTick> = {};
    for (const tick of ticks) {
      updates[tick.symbol] = tick;
    }
    
    // Step 2: Atomic State Commit.
    // Instead of updating the Zustand state 50 different times for 50 different stocks
    // (which would cause the UI to completely freeze and re-render 50 times),
    // we take the entire dictionary and inject it into Zustand in ONE single batched move.
    // This is the absolute secret to Zero-UI-Tearing and 60fps performance!
    useMarketStore.getState().updatePrices(updates);
  }
}
