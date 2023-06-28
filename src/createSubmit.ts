import { parseDateKey } from "./dateKey.ts";
import { DEFAULT_HOURS } from "./index.ts";
import { isWeekend } from "./isWeekend.ts";
import { dateKeysInPeriod } from "./period.ts";
import { Day, store } from "./store.ts";

export type SubmitData = Array<{
  date: Date;
  data: Day;
}>;

export const createSubmit = (date: Date): SubmitData => {
  const keys = dateKeysInPeriod(date);

  return keys.map((key) => {
    let data = store[key] ?? DEFAULT_HOURS;

    const date = parseDateKey(key);
    if (isWeekend(date)) {
      data = 0;
    }

    return {
      date: parseDateKey(key),
      data,
    };
  });
};
