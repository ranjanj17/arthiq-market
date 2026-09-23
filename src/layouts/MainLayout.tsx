import React from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { Header } from '../components/Header/Header';
import { BottomTabBar } from '../components/BottomTabBar/BottomTabBar';
import { StockList } from '../components/StockList/StockList';
import { StockDetailModal } from '../components/StockDetailModal/StockDetailModal';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';
import { useMarketData } from '../hooks/useMarketData';

export const MainLayout: React.FC = () => {
  const { subscriptionManager } = useMarketData();
  const [selectedStock, setSelectedStock] = React.useState<{ symbol: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'home' | 'watchlist' | 'portfolio' | 'orders' | 'account'>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <StockList 
            subscriptionManager={subscriptionManager} 
            searchQuery={searchQuery}
            onStockPress={(symbol, name) => setSelectedStock({ symbol, name })}
          />
        );
      case 'watchlist':
        return (
          <WatchlistScreen 
            subscriptionManager={subscriptionManager}
            onStockPress={(symbol, name) => setSelectedStock({ symbol, name })}
          />
        );
      case 'portfolio':
        return <PortfolioScreen subscriptionManager={subscriptionManager} />;
      default:
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#6B7280' }}>Coming Soon</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <View style={styles.container}>
        {renderContent()}
      </View>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

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
