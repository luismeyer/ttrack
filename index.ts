import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";

import { createDateKey, parseDateKey } from "./dateKey.ts";
import { initStore } from "./initStore.ts";
import { dateKeysInPeriod, endOfPeriod } from "./period.ts";
import { printGreen, printRed, printSubmit } from "./print.ts";
import { parseDate } from "./parseDate.ts";
import { syncSubmit } from "./syncSubmit.ts";

const DEFAULT_HOURS = 8;

const store = initStore();

const utCommand = new Command()
  .description("Register undertime.")
  .option("-d, --date <date:string>", "Date to register change.")
  .arguments("<amount:integer>")
  .action(({ date }, amount) => {
    if (amount === undefined) {
      return;
    }

    const parsedDate = parseDate(date);
    const key = createDateKey(parsedDate);

    store[key] = DEFAULT_HOURS - amount;
    printRed(`Time set to ${store[key]} hours.`);
  });

const otCommand = new Command()
  .description("Register overtime.")
  .option("-d, --date <date:string>", "Date to register change.")
  .arguments("<amount:integer>")
  .action(({ date }, amount) => {
    if (amount === undefined) {
      return;
    }

    const parsedDate = parseDate(date);
    const key = createDateKey(parsedDate);

    store[key] = DEFAULT_HOURS + amount;
    printGreen(`Time set to ${store[key]} hours.`);
  });

const submitCommand = new Command()
  .description("Print times for this period.")
  .option("-d, --date <date:string>", "Date to find submit period.")
  .action(async ({ date }) => {
    const inputDate = parseDate(date) ?? new Date();

    const keys = dateKeysInPeriod(inputDate);
    const endDate = endOfPeriod(inputDate);

    const output = keys.map((key) => ({
      date: parseDateKey(key),
      hours: store[key] ?? DEFAULT_HOURS,
    }));

    const success = await syncSubmit(output, endDate);

    if (success) {
      printSubmit(output);
    }
  });

await new Command()
  .command("ut", utCommand)
  .command("ot", otCommand)
  .command("submit", submitCommand)
  .parse(Deno.args);
