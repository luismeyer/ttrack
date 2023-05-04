import { dateKey } from "./dateKey.ts";

const endOfMonth = (year: number, month: number): number => {
  // 0 day of next month is the last day of this month
  return new Date(year, month + 1, 0).getDate();
};

const createPeriodDates = (
  year: number,
  month: number,
  start: number,
  end: number
): string[] => {
  let result: string[] = [];

  for (let i = start; i <= end; i++) {
    const newDateKey = dateKey(year, month, i);

    result = [...result, newDateKey];
  }

  return result;
};

const firstPeriodDates = (year: number, month: number): string[] => {
  return createPeriodDates(year, month, 1, 15);
};

const secondPeriodDates = (year: number, month: number): string[] => {
  return createPeriodDates(year, month, 16, endOfMonth(year, month));
};

const isFirstPeroiod = (date: Date): boolean => {
  const day = date.getDate();
  return day <= 15;
};

export const dateKeysInPeriod = (date: Date): string[] => {
  const month = date.getMonth();
  const year = date.getFullYear();

  if (isFirstPeroiod(date)) {
    return firstPeriodDates(year, month);
  } else {
    return secondPeriodDates(year, month);
  }
};
