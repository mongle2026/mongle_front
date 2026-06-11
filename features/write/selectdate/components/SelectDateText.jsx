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
      <Text style={styles.title}>편지가 도착할 날짜를 선택해 주세요.</Text>
      <Text style={styles.caption}><Text style={styles.selectText}>{captionDate} 0시</Text> 편지가 도착합니다.</Text>
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
    ...typo.titleXLarge,
    color: colors.fgNeutral
  },
  caption: {
    ...typo.bodyMedium,
    color: colors.fgLayerNeutralWeak
  },
  selectText: {
    color: colors.fgBrand
  }
})

export default SelectDateText