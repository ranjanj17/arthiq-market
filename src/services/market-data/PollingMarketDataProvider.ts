import { MarketDataProvider } from './MarketDataProvider';
import { MarketTick } from '../../types/market';
import { isMarketOpen, getMillisecondsUntilMarketOpen } from '../../utils/marketTime';

/**
 * The Polling Engine. This class acts as a fake WebSocket.
 * It constantly loops in the background every 500ms, hitting the live Liquide API,
 * but it strictly limits its payload to the specific stocks the SubscriptionManager tells it to.
 */
export class PollingMarketDataProvider implements MarketDataProvider {
  // The master list of stocks we are currently tracking on-screen.
  private subscriptions: Set<string> = new Set();
  
  private isConnected: boolean = false;
  private pollingIntervalMs: number;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isFetching: boolean = false;
  private needsRefetch: boolean = false;
  private consecutive429s: number = 0;
  
  
  // A list of "callbacks" (functions) that want to be notified when new prices arrive.
  // Right now, the TickProcessor is the only listener.
  private listeners: Set<(ticks: MarketTick[]) => void> = new Set();
  
  constructor(pollingIntervalMs: number = 2000) {
    this.pollingIntervalMs = pollingIntervalMs;
  }

  /**
   * Turns the polling engine on.
   */
  connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    this.scheduleNextPoll();
  }

  /**
   * Turns the polling engine off and stops all loops.
   */
  disconnect(): void {
    this.isConnected = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  /**
   * Called by the SubscriptionManager when new stocks scroll onto the screen.
   */
  subscribe(symbols: string[]): void {
    let changed = false;
    for (const sym of symbols) {
      if (!this.subscriptions.has(sym)) {
        this.subscriptions.add(sym);
        changed = true;
      }
    }
    // Optimization: If a user scrolls, we instantly trigger a fetch so they don't 
    // have to wait for the next 500ms cycle to see the first price.
    if (changed && this.isConnected) {
      if (this.isFetching) {
        // If we are currently fetching, flag that we need to instantly fetch again when done.
        this.needsRefetch = true;
      } else {
        this.fetchData();
      }
    }
  }

  /**
   * Called by the SubscriptionManager when stocks scroll OFF the screen.
   */
  unsubscribe(symbols: string[]): void {
    for (const sym of symbols) {
      this.subscriptions.delete(sym);
    }
  }

  /**
   * Used by the TickProcessor to "hook into" the live price feed.
   */
  onTick(callback: (ticks: MarketTick[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Sets a timer to run `fetchData` after the polling interval (e.g., 500ms).
   */
  private scheduleNextPoll() {
    if (!this.isConnected) return;
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    this.timeoutId = setTimeout(() => {
      this.fetchData();
    }, this.pollingIntervalMs);
  }

  /**
   * The core loop. It hits the Liquide API, gets the data, hands it to the TickProcessor,
   * and then calculates when it should run again.
   */
  private async fetchData() {
    // Prevent double-fetching if the network is being slow
    if (!this.isConnected || this.isFetching) return;
    
    const symbolsToFetch = Array.from(this.subscriptions);
    
    // If the user scrolled to an empty screen, just wait 500ms and check again.
    if (symbolsToFetch.length === 0) {
      this.scheduleNextPoll();
      return;
    }

    this.isFetching = true;
    const startTime = Date.now();
    
    let forcedDelay = 0;
    
    try {
      // Add a 5-second timeout so a hanging network request never freezes the UI updates forever
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 5000);
      
      // Hit the live API for ONLY the symbols currently on screen
      const response = await fetch('https://api.v2.liquide.life/api/markets/ohlc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        body: JSON.stringify({ symbols: symbolsToFetch }),
        signal: controller.signal
      });
      
      clearTimeout(fetchTimeout);
      
      const json = await response.json();
      
      if (json.code === 429) {
        this.consecutive429s += 1;
        forcedDelay = Math.min(5000, 1000 * this.consecutive429s);
      } else {
        this.consecutive429s = 0;
      }
      
      if (json.status === 'success' && json.message?.data) {
        const rawData: any[] = json.message.data;
        
        // Map the raw API data into our clean TypeScript interfaces
        const ticks: MarketTick[] = rawData.map(item => ({
          symbol: item.symbol,
          ltp: item.ltp,
          prevClose: item.prevClose,
          open: item.open,
          high: item.high,
          low: item.low,
          volume: item.volume,
          timeStamp: item.timeStamp,
        }));
        
        // Hand the fresh prices off to the TickProcessor
        if (ticks.length > 0) {
          this.listeners.forEach(listener => {
            listener(ticks);
          });
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Polling error:', err);
      }
    } finally {
      this.isFetching = false;
      if (this.timeoutId) clearTimeout(this.timeoutId);
      
      // Massive Battery Saver Optimization:
      if (!isMarketOpen()) {
        // If the Indian Stock Market is closed (nights/weekends), the prices aren't moving.
        // Instead of polling every 500ms, we put the entire app to sleep until 9:15 AM tomorrow morning!
        const waitTimeMs = getMillisecondsUntilMarketOpen();
        this.timeoutId = setTimeout(() => {
          this.fetchData();
        }, waitTimeMs);
      } else {
        // Market is open: calculate next polling loop
        if (this.needsRefetch && forcedDelay === 0) {
          this.needsRefetch = false;
          // If we need a refetch due to scrolling, trigger it instantly
          this.timeoutId = setTimeout(() => {
            this.fetchData();
          }, 0);
        } else {
          // If the network request took 100ms, we only wait 400ms for the next loop to keep it exactly 500ms.
          const elapsed = Date.now() - startTime;
          const nextDelay = forcedDelay > 0 
            ? forcedDelay 
            : Math.max(0, this.pollingIntervalMs - elapsed);
          
          this.timeoutId = setTimeout(() => {
            this.fetchData();
          }, nextDelay);
        }
      }
    }
  }
}
