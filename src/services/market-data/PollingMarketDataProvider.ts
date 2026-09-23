import { MarketDataProvider } from './MarketDataProvider';
import { MarketTick } from '../../types/market';
import { isMarketOpen, getMillisecondsUntilMarketOpen } from '../../utils/marketTime';

export class PollingMarketDataProvider implements MarketDataProvider {
  private subscriptions: Set<string> = new Set();
  private isConnected: boolean = false;
  private pollingIntervalMs: number;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isFetching: boolean = false;
  private listeners: Set<(ticks: MarketTick[]) => void> = new Set();
  
  constructor(pollingIntervalMs: number = 2000) {
    this.pollingIntervalMs = pollingIntervalMs;
  }

  connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    this.scheduleNextPoll();
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  subscribe(symbols: string[]): void {
    let changed = false;
    for (const sym of symbols) {
      if (!this.subscriptions.has(sym)) {
        this.subscriptions.add(sym);
        changed = true;
      }
    }
    // Optionally trigger an immediate fetch if we just subscribed to new things
    if (changed && this.isConnected && !this.isFetching) {
      this.fetchData();
    }
  }

  unsubscribe(symbols: string[]): void {
    for (const sym of symbols) {
      this.subscriptions.delete(sym);
    }
  }

  onTick(callback: (ticks: MarketTick[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private scheduleNextPoll() {
    if (!this.isConnected) return;
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    this.timeoutId = setTimeout(() => {
      this.fetchData();
    }, this.pollingIntervalMs);
  }

  private async fetchData() {
    if (!this.isConnected || this.isFetching) return;
    
    const symbolsToFetch = Array.from(this.subscriptions);
    if (symbolsToFetch.length === 0) {
      this.scheduleNextPoll();
      return;
    }

    this.isFetching = true;
    const startTime = Date.now();
    
    try {
      const response = await fetch('https://api.v2.liquide.life/api/markets/ohlc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols: symbolsToFetch })
      });
      
      const json = await response.json();
      
      if (json.status === 'success' && json.message?.data) {
        const rawData: any[] = json.message.data;
        
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
        
        if (ticks.length > 0) {
          this.listeners.forEach(listener => {
            listener(ticks);
          });
        }
      }
    } catch (err) {
      console.warn('Polling error:', err);
    } finally {
      this.isFetching = false;
      if (this.timeoutId) clearTimeout(this.timeoutId);
      
      if (!isMarketOpen()) {
        // Market is closed: sleep until tomorrow morning
        const waitTimeMs = getMillisecondsUntilMarketOpen();
        this.timeoutId = setTimeout(() => {
          this.fetchData();
        }, waitTimeMs);
      } else {
        // Market is open: calculate next polling loop
        const elapsed = Date.now() - startTime;
        const nextDelay = Math.max(0, this.pollingIntervalMs - elapsed);
        
        this.timeoutId = setTimeout(() => {
          this.fetchData();
        }, nextDelay);
      }
    }
  }
}
