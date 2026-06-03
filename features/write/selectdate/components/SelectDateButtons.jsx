import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Button from '../../../../shared/components/Button';
import { padding, gap } from '../../../../shared/styles/token';

const SelectDateButtons = (
  {
    dateType,
    setDateType,
    setIsCalendarOpen,
  }
) => {
  const [selectedDateType, setSelectedDateType] = useState(null);

  const handleSelectDate = value => {
    setDateType(prev => (prev === value ? null : value))
    setIsCalendarOpen(false);
  };

  return (
    <View style={styles.container}>
      <Button
        label='일주일 뒤'
        color={dateType === 'week' ? 'brand' : 'defaultWeak'}
        onPress={() => handleSelectDate('week')}
      />
      <Button
        label='한 달 뒤'
        color={dateType === 'month' ? 'brand' : 'defaultWeak'}
        onPress={() => handleSelectDate('month')}
      />
      <Button
        label='일 년 뒤'
        color={dateType === 'year' ? 'brand' : 'defaultWeak'}
        onPress={() => handleSelectDate('year')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: padding.XL,
    gap: gap.M,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  }
})

export default SelectDateButtons