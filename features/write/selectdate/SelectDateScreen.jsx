import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import TopNavigation from '../../../shared/components/TopNavigation'
import SelectDateText from './components/SelectDateText';
import SelectDateButtons from './components/SelectDateButtons';
import SelectDateCalendar from './components/SelectDateCalendar';
import getTomorrowCalendarDate from './hook/getTomorrowCalendarDate';
import { colors } from '../../../shared/styles/color';
import { useRecordFormStore } from '../record/store/useRecordFormStore';

const SelectDateScreen = ({navigation}) => {
  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState(undefined);
  const [selectedDate, setSelectedDate] = useState(getTomorrowCalendarDate);
  const [dateType, setDateType] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [buttonDisabled, setButtonDisalbed] = useState(true);
  const setDeliveryAt = useRecordFormStore((state) => state.setDeliveryAt);


  useEffect(() => {
    if (dateType === null) setButtonDisalbed(true);
    else setButtonDisalbed(false);
  }, [dateType]);

  const handlePressNext = () => {
    if (dateType === null) return;

    setDeliveryAt(`${selectedDate.dateString} 00:00:00`);
    console.log('선택한 날짜:', `${selectedDate.dateString} 00:00:00`);

    navigation.navigate('Record');
  };

  return (
    <View>
      <TopNavigation
        title='나에게 전송'
        buttonLabel='다음'
        buttonDisabled={buttonDisabled}
        onPressBack={() => navigation.goBack()}
        onPressButton={handlePressNext}
      />

      <View style={styles.container}>
        <SelectDateText
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateType={dateType}
        />
        <SelectDateButtons
          dateType={dateType}
          setDateType={setDateType}
          setIsCalendarOpen={setIsCalendarOpen}
        />

        <SelectDateCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateType={dateType}
          setDateType={setDateType}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    color: colors.bgDefault
  }
});

export default SelectDateScreen