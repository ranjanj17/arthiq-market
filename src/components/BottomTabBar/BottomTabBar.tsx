import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  activeTab: 'home' | 'watchlist' | 'portfolio' | 'orders' | 'account';
  onTabChange: (tab: 'home' | 'watchlist' | 'portfolio' | 'orders' | 'account') => void;
};

export const BottomTabBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TouchableOpacity style={styles.tabItem} onPress={() => onTabChange('home')}>
        <Ionicons name="home-outline" size={24} color={activeTab === 'home' ? '#1E3A8A' : '#9CA3AF'} />
        <Text style={[styles.tabLabel, { color: activeTab === 'home' ? '#1E3A8A' : '#9CA3AF', fontWeight: activeTab === 'home' ? '700' : '500' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => onTabChange('watchlist')}>
        <Ionicons name="list" size={24} color={activeTab === 'watchlist' ? '#1E3A8A' : '#9CA3AF'} />
        <Text style={[styles.tabLabel, { color: activeTab === 'watchlist' ? '#1E3A8A' : '#9CA3AF', fontWeight: activeTab === 'watchlist' ? '700' : '500' }]}>Watchlist</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => onTabChange('portfolio')}>
        <Ionicons name="pie-chart-outline" size={24} color={activeTab === 'portfolio' ? '#1E3A8A' : '#9CA3AF'} />
        <Text style={[styles.tabLabel, { color: activeTab === 'portfolio' ? '#1E3A8A' : '#9CA3AF', fontWeight: activeTab === 'portfolio' ? '700' : '500' }]}>Portfolio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => onTabChange('orders')}>
        <Ionicons name="document-text-outline" size={24} color={activeTab === 'orders' ? '#1E3A8A' : '#9CA3AF'} />
        <Text style={[styles.tabLabel, { color: activeTab === 'orders' ? '#1E3A8A' : '#9CA3AF', fontWeight: activeTab === 'orders' ? '700' : '500' }]}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => onTabChange('account')}>
        <Ionicons name="person-outline" size={24} color={activeTab === 'account' ? '#1E3A8A' : '#9CA3AF'} />
        <Text style={[styles.tabLabel, { color: activeTab === 'account' ? '#1E3A8A' : '#9CA3AF', fontWeight: activeTab === 'account' ? '700' : '500' }]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
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
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
  },
});
