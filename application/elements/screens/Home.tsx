import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../helpers/lang';

export default function Home() {
  const t = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('home')}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24 },
});
