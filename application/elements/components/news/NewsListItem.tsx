import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Note } from '../../../dto/main/types.gen';
import ImagesGrid from '../notes/ImagesGrid';
import { sliceTitle } from '../../../helpers/sliceTitle';
import { LanguageContext } from '../../../helpers/lang';
import { formatDateShort } from '../../../helpers/formatDate';

interface NewsCardProps {
  item: Note;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  const { language } = useContext(LanguageContext);

  return (
    <View style={styles.card}>
      {item.images ? (
        <ImagesGrid urls={[item.images[0]]} isTouchable={false} />
      ) : ''}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <Text style={styles.cardContent}>{item.description && sliceTitle(item.description, 140)}</Text>
      <Text style={styles.cardDate}>{`${formatDateShort(item.created_on, language)}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8, paddingTop: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardContent: { fontSize: 14, color: '#666', paddingBottom: 12 },
  cardDate: { fontSize: 12, color: '#999', paddingBottom: 12 },
});

export default NewsCard;
