import { parseDateKey } from "./dateKey.ts";
import { DEFAULT_HOURS } from "./index.ts";
import { isWeekend } from "./isWeekend.ts";
import { dateKeysInPeriod } from "./period.ts";
import { store } from "./store.ts";

export type SubmitData = Array<{
  date: Date;
  hours: number;
}>;

export const createSubmit = (date: Date) => {
  const keys = dateKeysInPeriod(date);

  const output = keys.map((key) => {
    let hours = store[key] ?? DEFAULT_HOURS;

    const date = parseDateKey(key);
    if (isWeekend(date)) {
      hours = 0;
    }

    return {
      date: parseDateKey(key),
      hours,
    };
  });

  return output;
};
