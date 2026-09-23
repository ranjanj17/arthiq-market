import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onAvatarPress: () => void;
};

export const Header: React.FC<Props> = ({ searchQuery, onSearchChange, onAvatarPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.logoIcon}>
        <Text style={styles.logoText}>A</Text>
      </View>
      
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stocks, ETFs..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8} onPress={onAvatarPress}>
        <Text style={styles.avatarText}>RK</Text>
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#111827',
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
    height: 44, // Fixed height for input
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E3A8A',
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
});
