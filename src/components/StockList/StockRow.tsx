import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMarketStore } from '../../store/marketStore';

type Props = {
  symbol: string;
  name: string;
  onPress: (symbol: string, name: string) => void;
};

const StockRowComponent: React.FC<Props> = ({ symbol, name, onPress }: Props) => {
  // Select only the tick for this specific symbol
  const tick = useMarketStore((state: any) => state.prices[symbol]);

  // Compute percentage change if available
  let percentageChange = 0;
  let absoluteChange = 0;
  let isPositive = true;

  if (tick && tick.prevClose && tick.ltp) {
    absoluteChange = tick.ltp - tick.prevClose;
    percentageChange = (absoluteChange / tick.prevClose) * 100;
    isPositive = absoluteChange >= 0;
  }

  // Premium colors
  const upColor = '#00B852'; // Angel One style green
  const downColor = '#FF3B30'; // Crisp iOS style red
  const changeColor = isPositive ? upColor : downColor;
  
  // Very subtle, premium gradient background
  const gradientColors = isPositive 
    ? ['#F0FDF4', '#FFFFFF'] 
    : ['#FEF2F2', '#FFFFFF'];

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={() => onPress(symbol, name)}
      style={styles.container}
    >
      <LinearGradient
        colors={gradientColors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientFill}
      >
        <View style={styles.content}>
          {/* Left Side: Company Info */}
          <View style={styles.left}>
            <Text style={styles.symbol} numberOfLines={1}>{symbol}</Text>
            <Text style={styles.name} numberOfLines={2}>{name}</Text>
          </View>
          
          {/* Right Side: Price Info */}
          <View style={styles.right}>
            {tick ? (
              <>
                <View style={styles.priceContainer}>
                  <Text style={[styles.arrow, { color: changeColor }]}>
                    {isPositive ? '▲' : '▼'}
                  </Text>
                  <Text style={styles.price}>
                    {tick.ltp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </Text>
                </View>
                <View style={[styles.pill, { backgroundColor: isPositive ? '#E6F8ED' : '#FEECEB' }]}>
                  <Text style={[styles.change, { color: changeColor }]}>
                    {isPositive ? '+' : '-'}{Math.abs(absoluteChange).toFixed(2)} ({isPositive ? '+' : '-'}{Math.abs(percentageChange).toFixed(2)}%)
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.loadingContainer}>
                <View style={styles.shimmerPrice} />
                <View style={styles.shimmerChange} />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const StockRow = React.memo(StockRowComponent);

const styles = StyleSheet.create({
  container: {
    height: 104,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    // Soft premium shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  gradientFill: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  left: {
    flex: 1,
    paddingRight: 16,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 110,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C20',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  name: {
    fontSize: 13,
    color: '#6E7781',
    fontWeight: '500',
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  arrow: {
    fontSize: 12,
    marginRight: 4,
    fontWeight: '900',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C20',
    letterSpacing: 0.2,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  change: {
    fontSize: 13,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'flex-end',
  },
  shimmerPrice: {
    width: 80,
    height: 20,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 8,
  },
  shimmerChange: {
    width: 60,
    height: 16,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
  }
});
