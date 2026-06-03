const getDiffDaysFromToday = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);

  const today = new Date();

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const receiveDateOnly = new Date(year, month - 1, day);

  const diffMs = receiveDateOnly - todayOnly;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays;
};

export default getDiffDaysFromToday;