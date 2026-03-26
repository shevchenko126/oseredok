import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Note } from '../../../dto/main/types.gen';
import { sliceTitle } from '../../../helpers/sliceTitle';
import { LanguageContext } from '../../../helpers/lang';
import { formatDateShort } from '../../../helpers/formatDate';

interface DocumentCardProps {
  item: Note;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ item }) => {
  const { language } = useContext(LanguageContext);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <View style={styles.fileIcon}>
          <Text style={styles.fileIconText}>DOC</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.cardTitle}>{item.title || 'Untitled'}</Text>
        {item.description ? (
          <Text style={styles.cardContent}>{sliceTitle(item.description, 80)}</Text>
        ) : null}
        <Text style={styles.cardDate}>{formatDateShort(item.created_on, language)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 14,
  },
  fileIcon: {
    width: 44,
    height: 52,
    backgroundColor: '#f0f4ff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dce4ff',
  },
  fileIconText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5570c4',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#222', marginBottom: 3 },
  cardContent: { fontSize: 13, color: '#666', marginBottom: 4 },
  cardDate: { fontSize: 11, color: '#aaa' },
});

export default DocumentCard;
