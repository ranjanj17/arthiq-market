import React from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StockList } from './src/components/StockList/StockList';
import { StockDetailModal } from './src/components/StockDetailModal/StockDetailModal';
import { useMarketData } from './src/hooks/useMarketData';

function AppContent() {
  const { subscriptionManager } = useMarketData();
  const [selectedStock, setSelectedStock] = React.useState<{ symbol: string; name: string } | null>(null);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Ultra-Minimalist Search Header (Fintech Standard) */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>A</Text>
        </View>
        
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <Text style={styles.searchText}>Search stocks, ETFs...</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8}>
          <Text style={styles.avatarText}>RK</Text>
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* List Container */}
      <View style={styles.container}>
        <StockList 
          subscriptionManager={subscriptionManager} 
          onStockPress={(symbol, name) => setSelectedStock({ symbol, name })}
        />
      </View>

      {/* Premium Bottom Tab Bar */}
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

      <StockDetailModal 
        selectedStock={selectedStock} 
        onClose={() => setSelectedStock(null)} 
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#111827', // Very dark for the logo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 16,
  },
  searchText: {
    color: '#6B7280',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E3A8A', // Deep Blue for avatar
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
