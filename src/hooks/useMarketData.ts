import { useEffect, useMemo, useCallback } from 'react';
import { PollingMarketDataProvider } from '../services/market-data/PollingMarketDataProvider';
import { TickProcessor } from '../services/market-data/TickProcessor';
import { SubscriptionManager } from '../services/market-data/SubscriptionManager';
import { useAppLifecycle } from './useAppLifecycle';

export const useMarketData = () => {
  // Initialize services once
  const { provider, tickProcessor, subscriptionManager } = useMemo(() => {
    // Polling every 1500ms strikes the perfect balance between real-time data and device performance
    const prov = new PollingMarketDataProvider(1500);
    const processor = new TickProcessor();
    const subManager = new SubscriptionManager(prov, 10); // 10 buffer
    
    return {
      provider: prov,
      tickProcessor: processor,
      subscriptionManager: subManager,
    };
  }, []);

  useEffect(() => {
    // Setup listener
    const unsubscribe = provider.onTick((ticks: any) => {
      tickProcessor.processTicks(ticks);
    });
    
    provider.connect();
    tickProcessor.start();

    return () => {
      unsubscribe();
      tickProcessor.stop();
      provider.disconnect();
    };
  }, [provider, tickProcessor]);

  const handleForeground = useCallback(() => {
    provider.connect();
    tickProcessor.start();
  }, [provider, tickProcessor]);

  const handleBackground = useCallback(() => {
    provider.disconnect();
    tickProcessor.stop();
  }, [provider, tickProcessor]);

  useAppLifecycle(handleForeground, handleBackground);

  return { subscriptionManager };
};
