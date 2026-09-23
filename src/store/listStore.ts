import { create } from 'zustand';

export type ListState = {
  visibleSymbols: string[];
  setVisibleSymbols: (symbols: string[]) => void;
  
  activePageRange: { start: number; end: number };
  setActivePageRange: (start: number, end: number) => void;
};

export const useListStore = create<ListState>((set: any) => ({
  visibleSymbols: [],
  setVisibleSymbols: (symbols: string[]) => set({ visibleSymbols: symbols }),
  
  activePageRange: { start: 0, end: 60 }, // 3 pages of 20
  setActivePageRange: (start: number, end: number) => set({ activePageRange: { start, end } }),
}));
