import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { colors } from '../../../../shared/styles/color';
import { padding, gap, radius } from '../../../../shared/styles/token';
import { typo } from '../../../../shared/styles/typo';
import getLocalDateString from '../hook/getLocalDateString';
import ButtonIcon from '../../../../shared/components/ButtonIcon';
import ChevronIcon from '../../../../assets/icons/ic_chevron.svg';

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

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const getDateString = date => getLocalDateString(date);

const getTomorrowDateString = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return getDateString(date);
};

const getOneYearLaterDateString = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);

  return getDateString(date);
};

const getMonthString = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
};

const addMonth = (monthString, amount) => {
  const [year, month] = monthString.split('-').map(Number);
  const nextDate = new Date(year, month - 1 + amount, 1);

  return getMonthString(nextDate);
};

const SelectDateCalendar = ({
  selectedDate,
  setSelectedDate,
  dateType,
  setDateType,
  setDeliveryAt,
}) => {
  const todayDateString = getDateString(new Date());
  const minSelectableDate = getTomorrowDateString();
  const maxSelectableDate = getOneYearLaterDateString();

  const minVisibleMonth = todayDateString.slice(0, 7);
  const maxVisibleMonth = maxSelectableDate.slice(0, 7);

  const [visibleMonth, setVisibleMonth] = useState(minVisibleMonth);

  const [visibleYear, visibleMonthNumber] = visibleMonth.split('-').map(Number);

  const isMinVisibleMonth = visibleMonth <= minVisibleMonth;
  const isMaxVisibleMonth = visibleMonth >= maxVisibleMonth;

  const handlePressPrevMonth = () => {
    if (isMinVisibleMonth) return;

    setVisibleMonth(prev => addMonth(prev, -1));
  };

  const handlePressNextMonth = () => {
    if (isMaxVisibleMonth) return;

    setVisibleMonth(prev => addMonth(prev, 1));
  };

  const handleSelectDate = day => {
    if (day.dateString < minSelectableDate) return;
    if (day.dateString > maxSelectableDate) return;

    const isSameDate =
      dateType === 'date' &&
      selectedDate?.dateString === day.dateString;

    if (isSameDate) {
      setSelectedDate(null);
      setDateType(null);
      setDeliveryAt(null);
      return;
    }

    setSelectedDate(day);
    setDateType('date');
    setDeliveryAt(`${day.dateString} 00:00:00`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <Text style={styles.monthText}>
          {visibleYear}년 {visibleMonthNumber}월
        </Text>

        <View style={styles.arrowGroup}>
          <ButtonIcon
            Icon={ChevronIcon}
            size="M"
            variant="none"
            disabled={isMinVisibleMonth}
            onPress={handlePressPrevMonth}
            iconColor={colors.fgNeutral}
          />

          <ButtonIcon
            Icon={ChevronIcon}
            size="M"
            variant="none"
            disabled={isMaxVisibleMonth}
            onPress={handlePressNextMonth}
            iconColor={colors.fgNeutral}
            style={styles.rightArrowButton}
          />
        </View>
      </View>

      <View style={styles.weekRow}>
        {DAY_NAMES.map(dayName => (
          <View key={dayName} style={styles.calendarCell}>
            <Text style={styles.weekDayText}>{dayName}</Text>
          </View>
        ))}
      </View>

      <Calendar
        style={styles.calendar}
        key={visibleMonth}
        current={`${visibleMonth}-01`}
        minDate={minSelectableDate}
        maxDate={maxSelectableDate}
        hideExtraDays
        hideArrows
        hideDayNames
        renderHeader={() => null}
        enableSwipeMonths={false}
        dayComponent={({ date, state }) => {
          const isDisabled =
            state === 'disabled' ||
            date.dateString < minSelectableDate ||
            date.dateString > maxSelectableDate;

          const isSelected =
            dateType === 'date' &&
            selectedDate?.dateString === date.dateString;

          return (
            <Pressable
              disabled={isDisabled}
              onPress={() => handleSelectDate(date)}
              style={[
                styles.calendarCell,
                isSelected && styles.selectedDayButton,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isDisabled && styles.disabledDayText,
                  isSelected && styles.selectedDayText,
                ]}
              >
                {date.day}
              </Text>
            </Pressable>
          );
        }}
        theme={{
          calendarBackground: colors.bgDefault,

          'stylesheet.calendar.header': {
            header: {
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
            },
            week: {
              height: 0,
              marginTop: 0,
              marginBottom: 0,
            },
          },

          'stylesheet.calendar.main': {
            container: {
              width: '100%',
              paddingLeft: 0,
              paddingRight: 0,
              backgroundColor: colors.bgDefault,
            },
            monthView: {
              width: '100%',
              backgroundColor: colors.bgDefault,
            },
            week: {
              width: '100%',
              height: 48,
              marginTop: 0,
              marginBottom: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: padding.M,
    paddingHorizontal: padding.XL,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: gap.S,
    alignSelf: 'stretch',
    backgroundColor: colors.bgDefault,
  },

  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  monthText: {
    ...typo.titleLarge,
    color: colors.fgNeutral,
    textAlign: 'center',
  },

  arrowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap.S,
  },

  rightArrowButton: {
    transform: [{ scaleX: -1 }],
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },

  calendar: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.bgDefault,
  },

  calendarCell: {
    width: 48,
    height: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.M,
    backgroundColor: colors.bgDefault,
  },

  selectedDayButton: {
    backgroundColor: colors.fgBrand,
  },

  weekDayText: {
    ...typo.labelSmall,
    color: colors.fgNeutralWeak,
    textAlign: 'center',
  },

  dayText: {
    ...typo.labelSmall,
    color: colors.fgNeutral,
    textAlign: 'center',
  },

  disabledDayText: {
    color: colors.fgNeutralDisabled,
  },

  selectedDayText: {
    color: colors.fgNeutral,
  },
});

export default SelectDateCalendar;