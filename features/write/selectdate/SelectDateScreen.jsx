import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import TopNavigation from '../../../shared/components/TopNavigation'
import SelectDateText from './components/SelectDateText';
import SelectDateButtons from './components/SelectDateButtons';
import SelectDateCalendar from './components/SelectDateCalendar';
import getTomorrowCalendarDate from './utils/getTomorrowCalendarDate';
import { colors } from '../../../shared/styles/color';
import { useRecordFormStore } from '../record/store/useRecordFormStore';
import { createRecordFormData } from '../utils/createRecordFormData ';

const SelectDateScreen = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState(undefined);
  const [selectedDate, setSelectedDate] = useState(getTomorrowCalendarDate);
  const [dateType, setDateType] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [buttonDisabled, setButtonDisalbed] = useState(true);
  const setDeliveryAt = useRecordFormStore((state) => state.setDeliveryAt);
  const recordForm = useRecordFormStore();
  const userId = '1';



  useEffect(() => {
    if (dateType === null) setButtonDisalbed(true);
    else setButtonDisalbed(false);
  }, [dateType]);

  const handlePressNext = () => {
    if (dateType === null) return;

    console.log('선택한 날짜:', `${selectedDate.dateString} 00:00:00`);
    console.log('전역변수', recordForm.deliveryAt);
    console.log('dateType: ', dateType);

    const formData = createRecordFormData({
      userId,
      recordForm,
    });

    console.log('formData', formData);
    // navigation.navigate('LetterCoverSelect');
  };

  return (
    <View style={styles.container}>
      <TopNavigation
        title='나에게 전송'
        buttonLabel='전송'
        buttonDisabled={buttonDisabled}
        onPressBack={() => navigation.goBack()}
        onPressButton={handlePressNext}
      />

      <View>
        <SelectDateText
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateType={dateType}
        />
        <SelectDateButtons
          dateType={dateType}
          setDateType={setDateType}
          setIsCalendarOpen={setIsCalendarOpen}
          setDeliveryAt={setDeliveryAt}
        />

        <SelectDateCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateType={dateType}
          setDateType={setDateType}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          setDeliveryAt={setDeliveryAt}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDefault
  }
});

export default SelectDateScreen