import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';

export const AccountScreen: React.FC = () => {
  const account = useUserStore((state) => state.account);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{account.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.name}>{account.name}</Text>
          <Text style={styles.clientId}>Client ID: ARTHIQ001</Text>
        </View>
      </View>

      {/* Funds Card */}
      <View style={styles.fundsCard}>
        <View style={styles.fundsHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="wallet" size={20} color="#1E3A8A" style={{ marginRight: 8 }} />
            <Text style={styles.fundsTitle}>Trading Balance</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fundsRow}>
          <View>
            <Text style={styles.fundsValue}>₹{account.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
            <Text style={styles.fundsLabel}>Available Margin to Trade</Text>
          </View>
          <TouchableOpacity style={styles.addFundsBtn}>
            <Text style={styles.addFundsText}>ADD FUNDS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.fundsDetails}>
          <View style={styles.fundsDetailItem}>
            <Text style={styles.fundsDetailLabel}>Used Margin</Text>
            <Text style={styles.fundsDetailValue}>₹0.00</Text>
          </View>
          <View style={styles.fundsDetailItem}>
            <Text style={styles.fundsDetailLabel}>Total Balance</Text>
            <Text style={styles.fundsDetailValue}>₹{account.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuGroup}>
        <Text style={styles.menuHeader}>ACCOUNT SETTINGS</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="person-outline" size={22} color="#4B5563" style={styles.menuIcon} />
            <Text style={styles.menuText}>Profile Details</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="card-outline" size={22} color="#4B5563" style={styles.menuIcon} />
            <Text style={styles.menuText}>Bank & Mandates</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="document-text-outline" size={22} color="#4B5563" style={styles.menuIcon} />
            <Text style={styles.menuText}>Reports & Statements</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuGroup}>
        <Text style={styles.menuHeader}>PREFERENCES</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="settings-outline" size={22} color="#4B5563" style={styles.menuIcon} />
            <Text style={styles.menuText}>App Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuGroup}>
        <Text style={styles.menuHeader}>HELP & SUPPORT</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <Ionicons name="chatbubbles-outline" size={22} color="#4B5563" style={styles.menuIcon} />
            <Text style={styles.menuText}>Help Center</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <View style={styles.menuLeft}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  clientId: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  fundsCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fundsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fundsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  viewDetailsText: {
    fontSize: 13,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  fundsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fundsValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  fundsLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  addFundsBtn: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addFundsText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  fundsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fundsDetailItem: {
    flex: 1,
  },
  fundsDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  fundsDetailValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
  menuGroup: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  menuHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
