export const getCaptionDateLabel = (selectedDateType, dateOffsetLabel) => {
  if (!selectedDateType) return '선택한 날짜';

  const captionDateMap = {
    date: `${dateOffsetLabel}일 뒤`,
    week: '일주일 뒤',
    month: '한 달 뒤',
    year: '일 년 뒤',
  };

  return captionDateMap[selectedDateType] ?? '선택한 날짜';
};