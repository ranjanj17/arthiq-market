import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import * as SQLite from 'expo-sqlite';

// 1. Initialize SQLite Database synchronously
const db = SQLite.openDatabaseSync('arthiq.db');

// 2. Create the storage table if it doesn't exist
db.execSync(`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`);

// 3. Implement the Zustand StateStorage interface using SQLite
const sqliteStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const result = db.getFirstSync<{ value: string }>(
        'SELECT value FROM store WHERE key = ?',
        [name]
      );
      return result ? result.value : null;
    } catch (error) {
      console.error('SQLite getItem error:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      db.runSync(
        'INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)',
        [name, value]
      );
    } catch (error) {
      console.error('SQLite setItem error:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      db.runSync(
        'DELETE FROM store WHERE key = ?',
        [name]
      );
    } catch (error) {
      console.error('SQLite removeItem error:', error);
    }
  },
};

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
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
);
