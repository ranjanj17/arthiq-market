import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomTabBar: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="list" size={24} color="#1E3A8A" />
        <Text style={[styles.tabLabel, { color: '#1E3A8A', fontWeight: '700' }]}>Watchlist</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="pie-chart-outline" size={24} color="#9CA3AF" />
        <Text style={styles.tabLabel}>Portfolio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="document-text-outline" size={24} color="#9CA3AF" />
        <Text style={styles.tabLabel}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="person-outline" size={24} color="#9CA3AF" />
        <Text style={styles.tabLabel}>Account</Text>
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
