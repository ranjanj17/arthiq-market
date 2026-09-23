import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Header } from '../components/Header/Header';
import { BottomTabBar } from '../components/BottomTabBar/BottomTabBar';
import { StockList } from '../components/StockList/StockList';
import { StockDetailModal } from '../components/StockDetailModal/StockDetailModal';
import { useMarketData } from '../hooks/useMarketData';

export const MainLayout: React.FC = () => {
  const { subscriptionManager } = useMarketData();
  const [selectedStock, setSelectedStock] = React.useState<{ symbol: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <View style={styles.container}>
        <StockList 
          subscriptionManager={subscriptionManager} 
          searchQuery={searchQuery}
          onStockPress={(symbol, name) => setSelectedStock({ symbol, name })}
        />
      </View>

      <BottomTabBar />

      <StockDetailModal 
        selectedStock={selectedStock} 
        onClose={() => setSelectedStock(null)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
