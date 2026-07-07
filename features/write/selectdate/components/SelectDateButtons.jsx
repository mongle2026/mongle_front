import React from 'react'
import { StyleSheet, View } from 'react-native'
import Button from '../../../../shared/components/Button';
import { padding, gap } from '../../../../shared/styles/token';
import {
  getOneWeekLater,
  getOneMonthLater,
  getOneYearLater,
} from '../utils/date';

const getDateStringFromDeliveryAt = deliveryAt => {
  if (!deliveryAt) return null;

  if (deliveryAt instanceof Date) {
    const year = deliveryAt.getFullYear();
    const month = String(deliveryAt.getMonth() + 1).padStart(2, '0');
    const day = String(deliveryAt.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  return String(deliveryAt).slice(0, 10);
};

const SelectDateButtons = ({
  dateType,
  setDateType,
  setSelectedDate,
  setIsCalendarOpen,
  setDeliveryAt,
}) => {
  const handleSelectDate = value => {
    const isSameDateType = dateType === value;

    setIsCalendarOpen(false);

    if (isSameDateType) {
      setDateType(null);
      setSelectedDate(null);
      setDeliveryAt(null);
      return;
    }

    let deliveryAt = null;

    if (value === 'week') {
      deliveryAt = getOneWeekLater();
    } else if (value === 'month') {
      deliveryAt = getOneMonthLater();
    } else if (value === 'year') {
      deliveryAt = getOneYearLater();
    }

    const dateString = getDateStringFromDeliveryAt(deliveryAt);

    setDateType(value);
    setDeliveryAt(deliveryAt);
    setSelectedDate(
      dateString
        ? {
            dateString,
          }
        : null
    );
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