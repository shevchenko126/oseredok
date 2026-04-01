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
import { getDocuments, getFileUrl, Document } from '../../../api/main/documents';

const DocumentsScreen: React.FC = () => {
  const t = useTranslation();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const meResp = await getMe();
      const me = meResp.data as any;
      if (!me) return;

      const bId: number | undefined = me.building?.id;
      if (!bId) return;

      const resp = await getDocuments(bId);
      if (resp.data) setDocuments(resp.data.items);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, [loadDocuments]),
  );

  const handlePress = useCallback((doc: Document) => {
    if (doc.file_id) {
      Linking.openURL(getFileUrl(doc.file_id));
    }
  }, []);

  const renderItem = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={[styles.card, !item.file_id && styles.cardDisabled]}
      onPress={() => handlePress(item)}
      activeOpacity={item.file_id ? 0.7 : 1}
    >
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      {item.file_id && (
        <Ionicons name="open-outline" size={20} color="#888" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.spinner} color="#333" />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('documentsEmptyState')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  spinner: { marginTop: 40 },
  list: { padding: 16, paddingBottom: 80 },
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
  cardDisabled: { opacity: 0.6 },
  cardTitle: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500', marginRight: 10 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
});

export default DocumentsScreen;
