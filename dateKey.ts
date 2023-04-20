export const dateKey = (year: number, month: number, day: number) => {
  return `${year}-${month}-${day}`;
};

export const createDateKey = (date: Date) => {
  return dateKey(date.getFullYear(), date.getMonth(), date.getDate());
};

export const parseDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);

  return new Date(year, month, day);
};

export const formatDateKey = (key: string) => {
  const date = parseDateKey(key);

  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
