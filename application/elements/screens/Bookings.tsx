import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../../helpers/lang';

export default function Bookings() {
  const t = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('bookings')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 24 },
});