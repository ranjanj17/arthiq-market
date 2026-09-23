import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StockList } from '../components/StockList/StockList';
import { SubscriptionManager } from '../services/market-data/SubscriptionManager';
import { useUserStore } from '../store/userStore';

type Props = {
  subscriptionManager: SubscriptionManager;
  onStockPress: (symbol: string, name: string) => void;
};

export const WatchlistScreen: React.FC<Props> = ({ subscriptionManager, onStockPress }) => {
  const watchlist = useUserStore((state) => state.watchlist);

  return (
    <View style={styles.container}>
      {watchlist.length > 0 ? (
        <StockList 
          subscriptionManager={subscriptionManager} 
          onStockPress={onStockPress}
          filterSymbols={watchlist}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Watchlist Empty</Text>
          <Text style={styles.emptySubtitle}>Tap the star icon on any stock to add it to your watchlist.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
