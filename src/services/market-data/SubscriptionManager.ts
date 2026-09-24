import { MarketDataProvider } from './MarketDataProvider';

/**
 * The SubscriptionManager is the bridge between the UI (FlatList) and the Network (Polling API).
 * Its only job is to figure out EXACTLY which stocks are currently visible on your screen,
 * and tell the API to ONLY fetch live prices for those specific stocks.
 */
export class SubscriptionManager {
  private provider: MarketDataProvider;
  
  // Keeps track of the exact stock symbols we are currently asking the API for.
  private currentSubscriptions: Set<string> = new Set();
  
  
  
  // We fetch a few extra stocks above and below the screen so there's no lag when scrolling.
  private bufferSize: number;

  constructor(provider: MarketDataProvider, bufferSize: number = 10) {
    this.provider = provider;
    this.bufferSize = bufferSize;
  }

  /**
   * Called by the FlatList every time the user scrolls and new items appear on screen.
   * @param visibleSymbols The exact stocks currently visible on the phone screen.
   * @param allSymbols The entire master list of 5000+ stocks in the current search/filter.
   */
  public updateVisibleRange(visibleSymbols: string[], allSymbols: string[]) {
    // We instantly compute subscriptions. The PollingMarketDataProvider handles 
    // network throttling so we don't spam the API.
    this.computeAndApplySubscriptions(visibleSymbols, allSymbols);
  }

  /**
   * The core logic that figures out what to add and remove from the API payload.
   */
  private computeAndApplySubscriptions(visibleSymbols: string[], allSymbols: string[]) {
    // Edge Case: The user scrolled to an empty screen or closed the tab.
    // We immediately unsubscribe from everything to save battery/network.
    if (visibleSymbols.length === 0) {
      if (this.currentSubscriptions.size > 0) {
        const toUnsubscribe = Array.from(this.currentSubscriptions);
        this.provider.unsubscribe(toUnsubscribe);
        this.currentSubscriptions.clear();
      }
      return;
    }

    // Step 1: Find the exact index of the top-most and bottom-most visible stocks safely.
    // FlashList viewableItems are not always perfectly ordered, so we must calculate min/max.
    const indices = visibleSymbols.map(sym => allSymbols.indexOf(sym)).filter(i => i !== -1);
    
    if (indices.length === 0) return;
    
    const firstVisibleIndex = Math.min(...indices);
    const lastVisibleIndex = Math.max(...indices);

    // Step 2: Add our 'buffer'. If stocks 10 through 20 are visible, we actually want to 
    // subscribe to stocks 0 through 30. This pre-loads the prices just off-screen!
    const startIdx = Math.max(0, firstVisibleIndex - this.bufferSize);
    const endIdx = Math.min(allSymbols.length - 1, lastVisibleIndex + this.bufferSize);

    // This Set represents the perfect list of stocks we WANT to be subscribed to right now.
    const desiredSubscriptions = new Set(allSymbols.slice(startIdx, endIdx + 1));
    
    const toSubscribe: string[] = [];
    const toUnsubscribe: string[] = [];

    // Step 3: Loop through what we are CURRENTLY subscribed to. 
    // If we are subscribed to a stock that has scrolled far off-screen, flag it for unsubscription.
    for (const sym of this.currentSubscriptions) {
      if (!desiredSubscriptions.has(sym)) {
        toUnsubscribe.push(sym);
        this.currentSubscriptions.delete(sym);
      }
    }

    // Step 4: Loop through what we WANT to be subscribed to.
    // If a new stock just scrolled onto the screen, flag it for a new subscription.
    for (const sym of desiredSubscriptions) {
      if (!this.currentSubscriptions.has(sym)) {
        toSubscribe.push(sym);
        this.currentSubscriptions.add(sym);
      }
    }

    // Step 5: Send the exact diff (only the changes) to the Polling Engine!
    if (toUnsubscribe.length > 0) {
      this.provider.unsubscribe(toUnsubscribe);
    }
    if (toSubscribe.length > 0) {
      this.provider.subscribe(toSubscribe);
    }
  }
}
