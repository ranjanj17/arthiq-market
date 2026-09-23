import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMarketStore } from '../../store/marketStore';
import { useUserStore } from '../../store/userStore';

type Props = {
  selectedStock: { symbol: string; name: string } | null;
  onClose: () => void;
};

export const StockDetailModal: React.FC<Props> = ({ selectedStock, onClose }) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'details' | 'buy'>('details');
  const [quantity, setQuantity] = useState('1');
  
  const symbol = selectedStock?.symbol || '';
  const tick = useMarketStore((state: any) => state.prices[symbol]);
  
  const watchlist = useUserStore((state) => state.watchlist);
  const toggleWatchlist = useUserStore((state) => state.toggleWatchlist);
  const buyStock = useUserStore((state) => state.buyStock);
  const account = useUserStore((state) => state.account);

  const isWatchlisted = watchlist.indexOf(symbol) !== -1;

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
  
  const handleClose = () => {
    setMode('details');
    setQuantity('1');
    onClose();
  };

  const handleConfirmBuy = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid number of shares.');
      return;
    }
    
    if (!tick?.ltp) {
      Alert.alert('Price Error', 'Current price is unavailable.');
      return;
    }

    if (qty * tick.ltp > account.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to complete this purchase.');
      return;
    }

    buyStock(symbol, selectedStock.name, qty, tick.ltp);
    Alert.alert('Success', `Successfully bought ${qty} shares of ${symbol}!`);
    handleClose();
  };

  return (
    <Modal 
      visible={!!selectedStock} 
      animationType="slide" 
      transparent={true}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.contentContainer}>
              {/* Header */}
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.symbol}>{selectedStock.symbol}</Text>
                  <Text style={styles.name}>{selectedStock.name}</Text>
                </View>
                
                <TouchableOpacity onPress={() => toggleWatchlist(symbol)} style={styles.iconBtn}>
                  <Ionicons name={isWatchlisted ? "star" : "star-outline"} size={22} color={isWatchlisted ? "#F59E0B" : "#6B7280"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClose} style={[styles.iconBtn, { marginLeft: 8 }]}>
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

              {mode === 'details' ? (
                /* Details Grid */
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
              ) : (
                /* Buy Order Flow */
                <View style={styles.buyContainer}>
                  <Text style={styles.buyTitle}>Buy {symbol}</Text>
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput
                      style={styles.quantityInput}
                      keyboardType="numeric"
                      value={quantity}
                      onChangeText={setQuantity}
                      maxLength={6}
                    />
                  </View>
                  <View style={styles.marginRow}>
                    <Text style={styles.marginLabel}>Required Margin</Text>
                    <Text style={styles.marginValue}>
                      ₹{tick?.ltp ? (parseInt(quantity || '0', 10) * tick.ltp).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0'}
                    </Text>
                  </View>
                  <Text style={styles.balanceText}>Available Balance: ₹{account.balance.toLocaleString('en-IN')}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.footer}>
              {mode === 'details' ? (
                <>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00B852' }]} onPress={() => setMode('buy')}>
                    <Text style={styles.actionText}>BUY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}>
                    <Text style={styles.actionText}>SELL</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#6B7280', flex: 0.4 }]} onPress={() => setMode('details')}>
                    <Text style={styles.actionText}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#00B852' }]} onPress={handleConfirmBuy}>
                    <Text style={styles.actionText}>CONFIRM BUY</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
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
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 12,
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
  iconBtn: {
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    padding: 16,
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
  buyContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  quantityInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '700',
    width: 100,
    textAlign: 'center',
  },
  marginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  marginLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  marginValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  balanceText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
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
    marginHorizontal: 6,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  }
});
