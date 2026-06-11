export const formatDateTime = date => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} 00:00:00`;
};

export const getOneWeekLater = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  return formatDateTime(date);
};

export const getOneMonthLater = () => {
  const date = new Date();
  const originalDay = date.getDate();

  date.setMonth(date.getMonth() + 1);

  if (date.getDate() !== originalDay) {
    date.setDate(0);
  }

  return formatDateTime(date);
};

export const getOneYearLater = () => {
  const date = new Date();
  const originalMonth = date.getMonth();

  date.setFullYear(date.getFullYear() + 1);

  if (date.getMonth() !== originalMonth) {
    date.setDate(0);
  }

  return formatDateTime(date);
};