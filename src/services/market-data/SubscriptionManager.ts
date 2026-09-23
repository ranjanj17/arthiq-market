import { MarketDataProvider } from './MarketDataProvider';

export class SubscriptionManager {
  private provider: MarketDataProvider;
  private currentSubscriptions: Set<string> = new Set();
  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  private bufferSize: number;

  constructor(provider: MarketDataProvider, bufferSize: number = 10) {
    this.provider = provider;
    this.bufferSize = bufferSize;
  }

  public updateVisibleRange(visibleSymbols: string[], allSymbols: string[]) {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    
    // Coalesce updates during fast scrolling (e.g. 100ms)
    this.debounceTimeout = setTimeout(() => {
      this.computeAndApplySubscriptions(visibleSymbols, allSymbols);
    }, 100);
  }

  private computeAndApplySubscriptions(visibleSymbols: string[], allSymbols: string[]) {
    if (visibleSymbols.length === 0) {
      if (this.currentSubscriptions.size > 0) {
        const toUnsubscribe = Array.from(this.currentSubscriptions);
        this.provider.unsubscribe(toUnsubscribe);
        this.currentSubscriptions.clear();
      }
      return;
    }

    // We pad the visible range with bufferSize items above and below
    const firstVisibleIndex = allSymbols.indexOf(visibleSymbols[0]);
    const lastVisibleIndex = allSymbols.indexOf(visibleSymbols[visibleSymbols.length - 1]);

    if (firstVisibleIndex === -1 || lastVisibleIndex === -1) return;

    const startIdx = Math.max(0, firstVisibleIndex - this.bufferSize);
    const endIdx = Math.min(allSymbols.length - 1, lastVisibleIndex + this.bufferSize);

    const desiredSubscriptions = new Set(allSymbols.slice(startIdx, endIdx + 1));
    
    const toSubscribe: string[] = [];
    const toUnsubscribe: string[] = [];

    // Find what to unsubscribe
    for (const sym of this.currentSubscriptions) {
      if (!desiredSubscriptions.has(sym)) {
        toUnsubscribe.push(sym);
        this.currentSubscriptions.delete(sym);
      }
    }

    // Find what to subscribe
    for (const sym of desiredSubscriptions) {
      if (!this.currentSubscriptions.has(sym)) {
        toSubscribe.push(sym);
        this.currentSubscriptions.add(sym);
      }
    }

    if (toUnsubscribe.length > 0) {
      this.provider.unsubscribe(toUnsubscribe);
    }
    if (toSubscribe.length > 0) {
      this.provider.subscribe(toSubscribe);
    }
  }
}
