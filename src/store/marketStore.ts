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
        
        // Only update if value actually changed to prevent unnecessary re-renders
        if (!prevTick || prevTick.ltp !== tick.ltp || prevTick.prevClose !== tick.prevClose) {
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
