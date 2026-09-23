import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';
import { useMarketStore } from '../store/marketStore';
import { SubscriptionManager } from '../services/market-data/SubscriptionManager';

type Props = {
  subscriptionManager: SubscriptionManager;
};

export const PortfolioScreen: React.FC<Props> = ({ subscriptionManager }) => {
  const portfolio = useUserStore((state) => state.portfolio);
  const prices = useMarketStore((state) => state.prices);

  // Subscribe to all portfolio items
  useEffect(() => {
    const symbols = portfolio.map((p) => p.symbol);
    if (symbols.length > 0) {
      // Manually force subscription for portfolio screen
      // Since it's a small list typically, we can just subscribe to all of them
      subscriptionManager.updateVisibleRange(symbols, symbols);
    }
  }, [portfolio, subscriptionManager]);

  const stats = useMemo(() => {
    let totalInvestment = 0;
    let currentValue = 0;
    let dayPnL = 0;

    portfolio.forEach((item) => {
      const tick = prices[item.symbol];
      const invested = item.averageBuyPrice * item.quantity;
      totalInvestment += invested;

      if (tick && tick.ltp) {
        const current = tick.ltp * item.quantity;
        currentValue += current;

        if (tick.prevClose) {
          const prevValue = tick.prevClose * item.quantity;
          dayPnL += (current - prevValue);
        }
      } else {
        currentValue += invested; // Fallback if no price yet
      }
    });

    const totalPnL = currentValue - totalInvestment;
    const totalPnLPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    return {
      totalInvestment,
      currentValue,
      dayPnL,
      totalPnL,
      totalPnLPercent
    };
  }, [portfolio, prices]);

  const renderItem = ({ item }: { item: any }) => {
    const tick = prices[item.symbol];
    const ltp = tick?.ltp || item.averageBuyPrice;
    const pnl = (ltp - item.averageBuyPrice) * item.quantity;
    const pnlPercent = ((ltp - item.averageBuyPrice) / item.averageBuyPrice) * 100;
    const isPositive = pnl >= 0;
    const color = isPositive ? '#00B852' : '#FF3B30';

    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.qty}>Qty: {item.quantity} • Avg: {item.averageBuyPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.rowRight}>
          <Text style={styles.ltp}>{ltp.toFixed(2)}</Text>
          <Text style={[styles.pnl, { color }]}>
            {isPositive ? '+' : ''}{pnl.toFixed(2)} ({isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Current Value</Text>
            <Text style={styles.summaryValue}>₹{stats.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.summaryLabel}>Total Investment</Text>
            <Text style={styles.summaryValue}>₹{stats.totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Day P&L</Text>
            <Text style={[styles.pnlValue, { color: stats.dayPnL >= 0 ? '#00B852' : '#FF3B30' }]}>
              {stats.dayPnL >= 0 ? '+' : ''}₹{Math.abs(stats.dayPnL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.summaryLabel}>Total P&L</Text>
            <Text style={[styles.pnlValue, { color: stats.totalPnL >= 0 ? '#00B852' : '#FF3B30' }]}>
              {stats.totalPnL >= 0 ? '+' : ''}₹{Math.abs(stats.totalPnL).toLocaleString('en-IN', { maximumFractionDigits: 2 })} 
              <Text style={styles.pnlPercent}> ({stats.totalPnLPercent >= 0 ? '+' : ''}{stats.totalPnLPercent.toFixed(2)}%)</Text>
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.holdingsHeader}>Your Holdings ({portfolio.length})</Text>

      <FlatList
        data={portfolio}
        keyExtractor={item => item.symbol}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="pie-chart-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Portfolio Empty</Text>
            <Text style={styles.emptySubtitle}>Buy some stocks to see them here.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  summaryCard: {
    backgroundColor: '#1E3A8A', // Deep Blue premium feel
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  pnlValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  pnlPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  holdingsHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  rowLeft: {
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  qty: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  ltp: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  pnl: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
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
  }
});
