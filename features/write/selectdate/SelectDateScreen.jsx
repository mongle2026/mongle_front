import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import TopNavigation from '../../../shared/components/TopNavigation'
import SelectDateText from './components/SelectDateText';
import SelectDateButtons from './components/SelectDateButtons';
import SelectDateCalendar from './components/SelectDateCalendar';
import SelectedLetterCoverPreview from './components/SelectedLetterCoverPreview';
import { colors } from '../../../shared/styles/color';
import { padding, gap } from '../../../shared/styles/token';
import { useRecordFormStore } from '../record/store/useRecordFormStore';
import { createRecordFormData } from '../utils/createRecordFormData ';
import { useLetterCoverStore } from '../letter/data/letterCoverData';
import getDiffDaysFromToday from './hook/getDiffDaysFromToday ';
import { getCaptionDateLabel } from './utils/getCaptionDateLabel';
import { useFloatingBottomOffset } from '../record/hook/useFloatingBottomOffset';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const SelectDateScreen = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [date, setDate] = React.useState(undefined);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateType, setDateType] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [buttonDisabled, setButtonDisalbed] = useState(true);
  const setDeliveryAt = useRecordFormStore((state) => state.setDeliveryAt);
  const recordForm = useRecordFormStore();
  const [dateOffsetLabel, setDateOffsetLabel] = useState(null);
  const userId = '1';
  const recordType = useRecordFormStore(state => state.recordType);
  const { patternId, colorId, stampId } = useLetterCoverStore();

  const bottomValue = useFloatingBottomOffset();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (dateType === null) setButtonDisalbed(true);
    else setButtonDisalbed(false);
  }, [dateType]);

  useEffect(() => {
    if (!selectedDate?.dateString) {
      setDateOffsetLabel(null);
      return;
    }

    const diffDays = getDiffDaysFromToday(selectedDate.dateString);
    setDateOffsetLabel(diffDays);
  }, [selectedDate?.dateString]);

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

      const captionDate = getCaptionDateLabel(dateType, dateOffsetLabel)
      navigation.navigate('SendAnimation', {
        deliveryLabel: captionDate,
        toMe: true,
      });
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
        title='편지 도착 날짜 선택'
        buttonLabel='전송'
        buttonDisabled={buttonDisabled}
        onPressBack={() => navigation.goBack()}
        onPressButton={handleCommit}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: insets.bottom + padding.XL,
        }}
      >
        <View style={styles.letterSection}>
          <SelectedLetterCoverPreview />
        </View>

        <SelectDateText
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateType={dateType}
          dateOffsetLabel={dateOffsetLabel}
        />

        <SelectDateCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dateType={dateType}
          setDateType={setDateType}
          setDeliveryAt={setDeliveryAt}
        />

        <SelectDateButtons
          dateType={dateType}
          setDateType={setDateType}
          setIsCalendarOpen={setIsCalendarOpen}
          setDeliveryAt={setDeliveryAt}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDefault
  },

  scrollView: {
    flex: 1,
  },

  letterSection: {
    width: '100%',
    paddingVertical: padding.XL,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: gap.M,
  },
});

export default SelectDateScreen