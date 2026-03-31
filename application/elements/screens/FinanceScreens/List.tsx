import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '../../../helpers/lang';
import { getMe } from '../../../api/auth';
import { getMyApartment } from '../../../api/realestate';
import {
  getAccountByApartment,
  getEnvelopes,
  getPaymentsIn,
  getPaymentsOut,
  Envelope,
  PaymentIn,
  PaymentOut,
} from '../../../api/main/finance';
import { formatDateShort } from '../../../helpers/formatDate';

type Tab = 'envelopes' | 'paymentsIn' | 'paymentsOut';

const FinanceScreen: React.FC = () => {
  const t = useTranslation();

  const [activeTab, setActiveTab] = useState<Tab>('envelopes');
  const [balance, setBalance] = useState<string | null>(null);
  const [buildingId, setBuildingId] = useState<number | null>(null);

  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [paymentsIn, setPaymentsIn] = useState<PaymentIn[]>([]);
  const [paymentsOut, setPaymentsOut] = useState<PaymentOut[]>([]);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const meResp = await getMe();
      const me = meResp.data as any;
      if (!me) return;

      const bId: number | undefined = me.building?.id;
      const userId: number | undefined = me.id;
      if (!bId || !userId) return;

      setBuildingId(bId);

      const [aptResp, envResp] = await Promise.all([
        getMyApartment(userId, bId),
        getEnvelopes(bId),
      ]);

      if (aptResp.data) {
        const accResp = await getAccountByApartment(aptResp.data.id);
        if (accResp.data) setBalance(accResp.data.balance);
      }

      if (envResp.data) setEnvelopes(envResp.data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [loadInitialData]),
  );

  const handleTabPress = useCallback(
    async (tab: Tab) => {
      setActiveTab(tab);
      if (!buildingId) return;

      if (tab === 'envelopes' && envelopes.length === 0) {
        setTabLoading(true);
        const resp = await getEnvelopes(buildingId);
        if (resp.data) setEnvelopes(resp.data.items);
        setTabLoading(false);
      } else if (tab === 'paymentsIn' && paymentsIn.length === 0) {
        setTabLoading(true);
        const resp = await getPaymentsIn(buildingId);
        if (resp.data) setPaymentsIn(resp.data.items);
        setTabLoading(false);
      } else if (tab === 'paymentsOut' && paymentsOut.length === 0) {
        setTabLoading(true);
        const resp = await getPaymentsOut(buildingId);
        if (resp.data) setPaymentsOut(resp.data.items);
        setTabLoading(false);
      }
    },
    [buildingId, envelopes.length, paymentsIn.length, paymentsOut.length],
  );

  const renderEnvelope = ({ item }: { item: Envelope }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.link)}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Ionicons name="open-outline" size={20} color="#888" />
    </TouchableOpacity>
  );

  const renderPaymentIn = ({ item }: { item: PaymentIn }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.description || '—'}
        </Text>
        {item.created_at && (
          <Text style={styles.cardDate}>{formatDateShort(item.created_at)}</Text>
        )}
      </View>
      <Text style={styles.amountGreen}>+{item.amount} {t('uah')}</Text>
    </View>
  );

  const renderPaymentOut = ({ item }: { item: PaymentOut }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.description || '—'}
        </Text>
        {item.created_at && (
          <Text style={styles.cardDate}>{formatDateShort(item.created_at)}</Text>
        )}
      </View>
      <Text style={styles.amountRed}>-{item.amount} {t('uah')}</Text>
    </View>
  );

  const currentData =
    activeTab === 'envelopes'
      ? envelopes
      : activeTab === 'paymentsIn'
      ? paymentsIn
      : paymentsOut;

  const renderItem =
    activeTab === 'envelopes'
      ? renderEnvelope
      : activeTab === 'paymentsIn'
      ? renderPaymentIn
      : renderPaymentOut;

  return (
    <SafeAreaView style={styles.container}>
      {/* Balance header */}
      <View style={styles.balanceCard}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.balanceText}>
            {t('yourBalance')}: {balance ?? '0'} {t('uah')}
          </Text>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'envelopes' && styles.tabActive]}
          onPress={() => handleTabPress('envelopes')}
        >
          <Text style={[styles.tabText, activeTab === 'envelopes' && styles.tabTextActive]}>
            {t('envelopes')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'paymentsIn' && styles.tabActive]}
          onPress={() => handleTabPress('paymentsIn')}
        >
          <Text style={[styles.tabText, activeTab === 'paymentsIn' && styles.tabTextActive]}>
            {t('myContributions')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'paymentsOut' && styles.tabActive]}
          onPress={() => handleTabPress('paymentsOut')}
        >
          <Text style={[styles.tabText, activeTab === 'paymentsOut' && styles.tabTextActive]}>
            {t('expenses')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {tabLoading ? (
        <ActivityIndicator style={styles.tabSpinner} color="#333" />
      ) : (
        <FlatList
          data={currentData as any[]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem as any}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>{t('financeEmptyState')}</Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  balanceCard: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#3A5160',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  balanceText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#333',
    fontWeight: '600',
  },
  list: { padding: 16, paddingBottom: 80 },
  tabSpinner: { marginTop: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  cardLeft: { flex: 1, marginRight: 12 },
  cardTitle: { fontSize: 15, color: '#333', fontWeight: '500', flex: 1, marginRight: 8 },
  cardDate: { fontSize: 12, color: '#999', marginTop: 3 },
  amountGreen: { fontSize: 15, fontWeight: '700', color: '#27ae60' },
  amountRed: { fontSize: 15, fontWeight: '700', color: '#e74c3c' },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
});

export default FinanceScreen;
