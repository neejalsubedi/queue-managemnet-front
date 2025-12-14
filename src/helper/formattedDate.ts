const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const format12HourTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export const formattedToday = formatDate(today);
export const formattedYesterday = formatDate(yesterday);
export const formattedTime = format12HourTime(today);
export const formattedTomorrowDate = formatDate(tomorrow);
