import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  activeTab: 'home' | 'watchlist' | 'portfolio' | 'orders' | 'account';
  onTabChange: (tab: 'home' | 'watchlist' | 'portfolio' | 'orders' | 'account') => void;
};

export const BottomTabBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();

  const renderTab = (
    id: 'home' | 'watchlist' | 'portfolio' | 'orders' | 'account',
    iconName: keyof typeof Ionicons.glyphMap,
    label: string
  ) => {
    const isActive = activeTab === id;
    const color = isActive ? '#E11D48' : '#9CA3AF'; // Premium Rose Pink when active

    return (
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onTabChange(id)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {isActive && (
            <LinearGradient
              colors={['#FFF1F2', '#FFE4E6']} // Soft pink gradient background
              style={StyleSheet.absoluteFillObject}
              borderRadius={16}
            />
          )}
          <Ionicons name={iconName} size={22} color={color} />
        </View>
        <Text style={[styles.tabLabel, { color, fontWeight: isActive ? '700' : '500' }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {renderTab('home', 'home-outline', 'Home')}
      {renderTab('watchlist', 'list', 'Watchlist')}
      {renderTab('portfolio', 'pie-chart-outline', 'Portfolio')}
      {renderTab('orders', 'document-text-outline', 'Orders')}
      {renderTab('account', 'person-outline', 'Account')}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EAEDF0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64, // Fixed width for even spacing
  },
  iconContainer: {
    width: 48,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});
