import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PortfolioItem = {
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
};

export type UserState = {
  account: {
    name: string;
    balance: number;
  };
  watchlist: string[]; // Array of symbols
  portfolio: PortfolioItem[];
  
  // Actions
  toggleWatchlist: (symbol: string) => void;
  buyStock: (symbol: string, name: string, quantity: number, price: number) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      account: {
        name: 'Ranjan Kumar',
        balance: 100000, // ₹1,00,000 mock balance
      },
      watchlist: [],
      portfolio: [],

      toggleWatchlist: (symbol) => {
        const { watchlist } = get();
        if (watchlist.includes(symbol)) {
          set({ watchlist: watchlist.filter((s) => s !== symbol) });
        } else {
          set({ watchlist: [...watchlist, symbol] });
        }
      },

      buyStock: (symbol, name, quantity, price) => {
        const { portfolio, account } = get();
        const totalCost = quantity * price;

        // Ensure sufficient balance
        if (account.balance < totalCost) {
          alert('Insufficient balance to complete this purchase!');
          return;
        }

        // Deduct balance
        set({ account: { ...account, balance: account.balance - totalCost } });

        // Update portfolio
        const existingItem = portfolio.find((item) => item.symbol === symbol);
        if (existingItem) {
          // Calculate new average buy price
          const totalSpentBefore = existingItem.quantity * existingItem.averageBuyPrice;
          const newTotalSpent = totalSpentBefore + totalCost;
          const newQuantity = existingItem.quantity + quantity;
          const newAveragePrice = newTotalSpent / newQuantity;

          set({
            portfolio: portfolio.map((item) =>
              item.symbol === symbol
                ? { ...item, quantity: newQuantity, averageBuyPrice: newAveragePrice }
                : item
            ),
          });
        } else {
          // Add new item
          set({
            portfolio: [
              ...portfolio,
              { symbol, name, quantity, averageBuyPrice: price },
            ],
          });
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
