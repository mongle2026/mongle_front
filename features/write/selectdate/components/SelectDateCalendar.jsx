import React, { useState } from 'react'
import { Platform, StyleSheet, Text, View, Pressable } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Button from '../../../../shared/components/Button';
import { padding, gap } from '../../../../shared/styles/token';
import { colors } from '../../../../shared/styles/color';
import { typo } from '../../../../shared/styles/typo';
import getCalendarDate from '../hook/getCalendarDate';
import getLocalDateString from '../hook/getLocalDateString';

LocaleConfig.locales['ko-custom'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  dayNames: [
    '일요일', '월요일', '화요일', '수요일',
    '목요일', '금요일', '토요일',
  ],

  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],

  today: '오늘',
};

LocaleConfig.defaultLocale = 'ko-custom';

// const monthNames = LocaleConfig.locales['ko-custom'].monthNames;

// const getTomorrowDateString = () => {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   return getLocalDateString(tomorrow);
// };

const SelectDateCalendar = ({
  selectedDate,
  setSelectedDate,
  dateType,
  setDateType,
  isCalendarOpen,
  setIsCalendarOpen,
  setDeliveryAt,
}) => {
  // const [visibleMonth, setVisibleMonth] = useState(
  //   selectedDate.dateString.slice(0, 7)
  // );

  const todayDateString = getLocalDateString();
  // const minSelectableDate = getTomorrowDateString();

  // const visibleYear = Number(visibleMonth.split('-')[0]);
  // const visibleMonthNumber = Number(visibleMonth.split('-')[1]);

  // const handleSelectDate = day => {
  //   setSelectedDate(day);
  //   setVisibleMonth(day.dateString.slice(0, 7));
  // };

  // const handlePressPrevMonth = () => {
  //   const nextDate = new Date(visibleYear, visibleMonthNumber - 2, 1);
  //   setVisibleMonth(getCalendarDate(nextDate).dateString.slice(0, 7));
  // };

  // const handlePressNextMonth = () => {
  //   const nextDate = new Date(visibleYear, visibleMonthNumber, 1);
  //   setVisibleMonth(getCalendarDate(nextDate).dateString.slice(0, 7));
  // };


  const handlePressDateButton = value => {
    setDateType(prev => (prev === value ? null : value))
    setIsCalendarOpen(prev => !prev);
  };

  const handleSelectDate = day => {
    if (day.dateString <= todayDateString) return;

    setSelectedDate(day);
    setDeliveryAt(`${day.dateString} 00:00:00`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>직접 선택</Text>
      <Button
        label={`${selectedDate.year}년 ${selectedDate.month}월 ${selectedDate.day}일`}
        color={dateType === 'date' ? 'brand' : 'defaultWeak'}
        onPress={() => handlePressDateButton('date')}
      />

      {/* {isCalendarOpen && (
        <View style={styles.calendarContainer}>
          <View style={styles.customHeader}>
            <Pressable style={styles.monthButton}>
              <Text style={styles.monthText}>
                {visibleYear}년 {monthNames[visibleMonthNumber - 1]}
              </Text>
            </Pressable>

            <View style={styles.arrowGroup}>
              <Pressable onPress={handlePressPrevMonth} style={styles.arrowButton}>
                <Text style={styles.arrowText}>‹</Text>
              </Pressable>

              <Pressable onPress={handlePressNextMonth} style={styles.arrowButton}>
                <Text style={styles.arrowText}>›</Text>
              </Pressable>
            </View>
          </View>
          <Calendar
            style={styles.calendar}
            key={visibleMonth}
            current={`${visibleMonth}-01`}
            minDate={minSelectableDate}
            hideExtraDays={false}
            onDayPress={handleSelectDate}
            markedDates={{
              [selectedDate.dateString]: {
                selected: true,
                selectedColor: colors.fgBrand,
              },
            }}
            dayComponent={({ date, state }) => {
              const isSelected = date.dateString === selectedDate.dateString;
              const isToday = date.dateString === todayDateString;
              const isPastOrToday = date.dateString <= todayDateString;
              const isDisabled = state === 'disabled' || isPastOrToday;

              return (
                <Pressable
                  disabled={isDisabled}
                  onPress={() => handleSelectDate(date)}
                  style={[
                    styles.dayCircle,
                    isToday && styles.todayCircle,
                    isSelected && styles.selectedCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isDisabled && styles.disabledDayText,
                      isToday && styles.disabledDayText,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    {date.day}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      )} */}

      {isCalendarOpen && (
        <View style={styles.calendarWrapper}>
          <Calendar
            minDate={todayDateString}
            onDayPress={handleSelectDate}
            markedDates={{
              [selectedDate?.dateString]: {
                selected: true,
                selectedColor: colors.fgBrand,
              },
              [todayDateString]: {
                disabled: true,
                disableTouchEvent: true,
                customStyles: {
                  container: {
                    backgroundColor: colors.bgLayerWeak,
                    borderRadius: 20,
                  },
                },
              },
            }}
            markingType="custom"
            theme={{
              arrowColor: colors.fgBrand,
              
            }}
          />
        </View>
      )}
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    padding: padding.XL,
    gap: gap.M,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch'
  },
  caption: {
    ...typo.labelSmall,
    color: colors.fgPlaceholder
  },
  calendarWrapper: {
    width: '100%',
    padding: padding.L,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },

  // calendarContainer: {
  //   width: '100%',
  //   alignSelf: 'stretch',
  //   borderRadius: 5,
  //   backgroundColor: '#FFFFFF',
  //   overflow: 'hidden',
  // },
  // customHeader: {
  //   paddingTop: 21,
  //   paddingHorizontal: 32,
  //   paddingBottom: 16,
  //   alignItems: 'flex-start',
  //   alignSelf: 'stretch',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   gap: 0,
  // },

  // monthText: {
  //   fontSize: 15,
  //   fontWeight: '600',
  //   color: colors.fgLayerNeutral,
  // },
  // arrowGroup: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // arrowButton: {
  //   width: 32,
  //   height: 32,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // arrowText: {
  //   fontSize: 28,
  //   color: '#4A4A4A',
  //   lineHeight: 30,
  // },


  // calendar: {
  //   paddingHorizontal: 21,
  //   paddingBottom: 10,
  // },

  // dayCircle: {
  //   width: 36,
  //   height: 36,
  //   borderRadius: 100,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // todayCircle: {
  //   backgroundColor: colors.bgLayerWeak,
  // },

  // selectedCircle: {
  //   backgroundColor: '#64A8FF',
  // },

  // dayText: {
  //   color: '#222222',
  // },

  // disabledDayText: {
  //   color: '#BFC2C7',
  // },

  // selectedDayText: {
  //   color: '#FFFFFF',
  // },
})

export default SelectDateCalendar