import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ViewToken, Keyboard } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { StockRow } from './StockRow';
import { Stock } from '../../types/stock';
import { SubscriptionManager } from '../../services/market-data/SubscriptionManager';
import { useListStore } from '../../store/listStore';
import scripsData from '../../data/scrips.json';

const PAGE_SIZE = 20;

type Props = {
  subscriptionManager: SubscriptionManager;
  onStockPress: (symbol: string, name: string) => void;
  searchQuery?: string;
  filterSymbols?: string[];
  onRemove?: (symbol: string) => void;
};

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 10,
  minimumViewTime: 10,
};

export const StockList: React.FC<Props> = ({ subscriptionManager, onStockPress, searchQuery = '', filterSymbols, onRemove }: Props) => {
  const masterData = useMemo(() => {
    let rawData = scripsData as Stock[];

    if (filterSymbols) {
      rawData = rawData.filter(stock => filterSymbols.indexOf(stock.symbol) !== -1);
    }

    if (!searchQuery) return rawData;

    const lowerQuery = searchQuery.toLowerCase();
    return rawData.filter((stock) =>
      stock.symbol.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, filterSymbols]);

  const allSymbols = useMemo(() => masterData.map((s: Stock) => s.symbol), [masterData]);

  // We maintain the concept of active pages (e.g. 3 pages) for any page-level derived data 
  // or logic, separate from FlashList virtualization and from precise market subscriptions.
  // Using useListStore.getState() prevents StockList from re-rendering on every scroll.

  // FIRE-ONCE MOUNT FIX: Guarantee the first screen updates immediately without waiting for scroll
  useEffect(() => {
    if (allSymbols.length > 0) {
      const initialVisible = allSymbols.slice(0, 20);
      subscriptionManager.updateVisibleRange(initialVisible, allSymbols);
    }
  }, [allSymbols, subscriptionManager]);

  // Track visible symbols for SubscriptionManager
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length === 0) return;

    const indices = viewableItems
      .map(item => item.index)
      .filter((idx): idx is number => idx != null);
      
    if (indices.length === 0) return;
    
    const firstIndex = Math.min(...indices);
    const lastIndex = Math.max(...indices);
    
    // 1. Update active page window (3 pages) in the global store without re-rendering StockList
    const currentPage = Math.floor(firstIndex / PAGE_SIZE);
    const startPage = Math.max(0, currentPage - 1);
    const endPage = startPage + 3;

    useListStore.getState().setActivePageRange(
      startPage * PAGE_SIZE,
      endPage * PAGE_SIZE
    );

    // 2. Update SubscriptionManager visible range
    const visibleSymbols = viewableItems
      .map(item => item.item as Stock)
      .map(stock => stock.symbol);

    subscriptionManager.updateVisibleRange(visibleSymbols, allSymbols);

  }, [subscriptionManager, allSymbols]);

  const renderItem = useCallback(({ item }: { item: Stock }) => {
    return <StockRow symbol={item.symbol} name={item.name} onPress={onStockPress} onRemove={onRemove} />;
  }, [onStockPress, onRemove]);

  const keyExtractor = useCallback((item: Stock) => item.symbol, []);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No stocks found</Text>
      <Text style={styles.emptySubtitle}>We couldn't find any match for "{searchQuery}".</Text>
    </View>
  ), [searchQuery]);

  return (
    <View style={styles.container}>
      <FlashList
        data={masterData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        estimatedItemSize={116}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  }
});
