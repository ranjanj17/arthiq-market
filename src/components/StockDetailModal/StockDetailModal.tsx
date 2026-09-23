import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMarketStore } from '../../store/marketStore';

type Props = {
  selectedStock: { symbol: string; name: string } | null;
  onClose: () => void;
};

export const StockDetailModal: React.FC<Props> = ({ selectedStock, onClose }) => {
  const insets = useSafeAreaInsets();
  const symbol = selectedStock?.symbol || '';
  const tick = useMarketStore((state: any) => state.prices[symbol]);

  if (!selectedStock) return null;

  let percentageChange = 0;
  let absoluteChange = 0;
  let isPositive = true;

  if (tick && tick.prevClose && tick.ltp) {
    absoluteChange = tick.ltp - tick.prevClose;
    percentageChange = (absoluteChange / tick.prevClose) * 100;
    isPositive = absoluteChange >= 0;
  }

  const changeColor = isPositive ? '#00B852' : '#FF3B30';

  return (
    <Modal 
      visible={!!selectedStock} 
      animationType="slide" 
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.symbol}>{selectedStock.symbol}</Text>
                <Text style={styles.name}>{selectedStock.name}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <Text style={styles.ltp}>
                {tick ? tick.ltp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '--'}
              </Text>
              {tick && (
                <View style={[styles.pill, { backgroundColor: isPositive ? '#E6F8ED' : '#FEECEB' }]}>
                  <Text style={[styles.change, { color: changeColor }]}>
                    {isPositive ? '▲' : '▼'} {Math.abs(absoluteChange).toFixed(2)} ({Math.abs(percentageChange).toFixed(2)}%)
                  </Text>
                </View>
              )}
            </View>

            {/* Details Grid */}
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Open</Text>
                <Text style={styles.gridValue}>{tick?.open ? tick.open.toFixed(2) : '--'}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>High</Text>
                <Text style={styles.gridValue}>{tick?.high ? tick.high.toFixed(2) : '--'}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Low</Text>
                <Text style={styles.gridValue}>{tick?.low ? tick.low.toFixed(2) : '--'}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Prev Close</Text>
                <Text style={styles.gridValue}>{tick?.prevClose ? tick.prevClose.toFixed(2) : '--'}</Text>
              </View>
              <View style={[styles.gridItem, { width: '100%', marginTop: 8, marginBottom: 0 }]}>
                <Text style={styles.gridLabel}>Volume</Text>
                <Text style={styles.gridValue}>{tick?.volume ? tick.volume.toLocaleString('en-IN') : '--'}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00B852' }]}>
              <Text style={styles.actionText}>BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}>
              <Text style={styles.actionText}>SELL</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Soft dimming so it doesn't mix with background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24, // Fully rounded on all sides
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12, // Tighter
  },
  symbol: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Tighter
  },
  ltp: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginRight: 10,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  change: {
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16, // Perfect internal padding
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  gridItem: {
    width: '48%',
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16, // Symmetric padding for the bottom!
    borderTopWidth: 1,
    borderTopColor: '#EAEDF0',
    backgroundColor: '#ffffff',
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6, // Tighter gap between buttons
  },
  actionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  }
});
