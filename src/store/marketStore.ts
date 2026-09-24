import { create } from 'zustand';
import { MarketState } from '../types/market';

export const useMarketStore = create<MarketState>((set: any) => ({
  prices: {},
  updatePrices: (updates: any) =>
    set((state: MarketState) => {
      let hasChanges = false;
      const nextPrices = { ...state.prices };
      
      for (const symbol in updates) {
        const tick = updates[symbol];
        const prevTick = nextPrices[symbol];
        // 1. Only update if the new timestamp is GREATER or EQUAL to the one we have
        // This guarantees stale data from a lagging network request can NEVER overwrite fresh data
        const isNewer = !prevTick || !prevTick.timeStamp || !tick.timeStamp || tick.timeStamp >= prevTick.timeStamp;
        
        // 2. Only update if value actually changed to prevent unnecessary re-renders
        if (isNewer && (!prevTick || prevTick.ltp !== tick.ltp || prevTick.prevClose !== tick.prevClose)) {
          nextPrices[symbol] = {
            ...prevTick,
            ...tick,
          };
          hasChanges = true;
        }
      }

      if (!hasChanges) {
        return state;
      }
      
      return { prices: nextPrices };
    }),
}));
