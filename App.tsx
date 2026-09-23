import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainLayout } from './src/layouts/MainLayout';

export default function App() {
  return (
    <SafeAreaProvider>
      <MainLayout />
    </SafeAreaProvider>
  );
}
