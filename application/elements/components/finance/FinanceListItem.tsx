import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../../../dto/main/types.gen';
import { useTranslation } from '../../../helpers/lang';

interface FinanceCardProps {
  item: Task;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ item }) => {
  const t = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      {item.description ? (
        <Text style={styles.cardContent}>{item.description}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  cardContent: { fontSize: 13, color: '#666' },
});

export default FinanceCard;
