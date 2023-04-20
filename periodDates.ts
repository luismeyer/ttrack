import { dateKey } from "./dateKey.ts";

const endOfMonth = (year: number, month: number): number => {
  // 0 day of next month is the last day of this month
  return new Date(year, month + 1, 0).getDate();
};

const firstPeriodDates = (year: number, month: number): string[] => {
  let result: string[] = [];

  for (let i = 1; i <= 15; i++) {
    result = [...result, dateKey(year, month, i)];
  }

  return result;
};

const secondPeriodDates = (year: number, month: number): string[] => {
  let result: string[] = [];

  for (let i = 16; i <= endOfMonth(year, month); i++) {
    result = [...result, dateKey(year, month, i)];
  }

  return result;
};

export const periodDates = (date: Date): string[] => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const day = date.getDate();

  if (day <= 15) {
    return firstPeriodDates(year, month);
  } else {
    return secondPeriodDates(year, month);
  }
};
