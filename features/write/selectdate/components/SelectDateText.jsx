import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typo } from '../../../../shared/styles/typo';
import { colors } from '../../../../shared/styles/color';
import getDiffDaysFromToday from '../hook/getDiffDaysFromToday ';
import { padding } from '../../../../shared/styles/token';
import { getCaptionDateLabel } from '../utils/getCaptionDateLabel';

const SelectDateText = ({
  selectedDate,
  setSelectedDate,
  dateType,
  dateOffsetLabel,
}) => {
  const captionDate = getCaptionDateLabel(dateType, dateOffsetLabel)

  return (
    <View style={styles.container}>
      <Text style={styles.title}><Text style={styles.selectText}>{captionDate} 0시</Text>에 편지가 도착합니다.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: padding.XL,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch'
  },

  title: {
    ...typo.titleLarge,
    color: colors.fgLayerNeutralWeak
  },
  selectText: {
    color: colors.fgBrand
  }
})

export default SelectDateText