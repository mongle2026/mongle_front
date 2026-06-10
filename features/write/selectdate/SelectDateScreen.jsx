import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import axios from 'axios';
import TopNavigation from '../../../shared/components/TopNavigation'
import SelectDateText from './components/SelectDateText';
import SelectDateButtons from './components/SelectDateButtons';
import SelectDateCalendar from './components/SelectDateCalendar';
import getTomorrowCalendarDate from './utils/getTomorrowCalendarDate';
import { colors } from '../../../shared/styles/color';
import { useRecordFormStore } from '../record/store/useRecordFormStore';
import { createRecordFormData } from '../utils/createRecordFormData ';
import { useLetterCoverStore } from '../letter/data/letterCoverData';

const API_BASE_URL = 'http://192.168.0.3:3000';

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
  const recordType = "LETTER";
  const { patternId, colorId, stampId } = useLetterCoverStore();



  useEffect(() => {
    if (dateType === null) setButtonDisalbed(true);
    else setButtonDisalbed(false);
  }, [dateType]);

  const handleCommit = async () => {
    if (dateType === null) return;

    console.log('선택한 날짜:', `${selectedDate.dateString} 00:00:00`);
    console.log('전역변수', recordForm.deliveryAt);
    console.log('dateType: ', dateType);

    try {
      const formData = createRecordFormData({
        userId,
        recordForm,
        recordType,
        letterCover: {
          patternId,
          colorId,
          stampId,
        },
      });

      console.log('저장되는 값', formData);

      const response = await axios.post(
        `${API_BASE_URL}/letter`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: data => data,
        }
      );

      console.log('요청 성공:', response.data);

      // recordForm.resetForm();

      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Main' }],
      // });

    } catch (error) {
      console.log('handleCommit 전체 에러:', error);

      if (error.response) {
        console.log('요청 실패 상태:', error.response.status);
        console.log('요청 실패 데이터:', error.response.data);
        console.log('요청 실패 헤더:', error.response.headers);
      } else if (error.request) {
        console.log('응답 없음:', error.request);
      } else {
        console.log('요청 설정 또는 프론트 코드 오류:', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TopNavigation
        title='나에게 전송'
        buttonLabel='전송'
        buttonDisabled={buttonDisabled}
        onPressBack={() => navigation.goBack()}
        onPressButton={handleCommit}
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