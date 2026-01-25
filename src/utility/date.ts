export const formatDateYYYYMMDD = (date: Date) => {
  const safe = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0
  );

  return `${safe.getFullYear()}-${String(
    safe.getMonth() + 1
  ).padStart(2, "0")}-${String(safe.getDate()).padStart(2, "0")}`;
};



export const parseYYYYMMDDToDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
};


