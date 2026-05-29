// RecordFormDebug.jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRecordFormStore } from '../../record/store/useRecordFormStore.js';

const RecordFormDebug = () => {
  const recordForm = useRecordFormStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>현재 전역 상태</Text>

      <ScrollView style={styles.box}>
        <Text style={styles.text}>
          {JSON.stringify(recordForm, null, 2)}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  box: {
    maxHeight: 400,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  text: {
    fontSize: 13,
    lineHeight: 20,
  },
});

export default RecordFormDebug;