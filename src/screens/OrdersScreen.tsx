import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const OrdersScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No Orders</Text>
        <Text style={styles.emptySubtitle}>You don't have any active or past orders today.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0, // Centered
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
