import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";

import { createSubmit } from "./createSubmit.ts";
import { createDateKey } from "./dateKey.ts";
import { parseDate } from "./parseDate.ts";
import { endOfPeriod } from "./period.ts";
import { printGreen, printRed, printSubmit } from "./print.ts";
import { store } from "./store.ts";
import { syncSubmit } from "./syncSubmit.ts";

export const DEFAULT_HOURS = 8;

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
  .option("-s --sync", "Sync submit to server.")
  .action(async ({ date, sync }) => {
    const inputDate = parseDate(date) ?? new Date();

    const submit = createSubmit(inputDate);
    const endDate = endOfPeriod(inputDate);

    const success = sync ? await syncSubmit(submit, endDate) : true;

    if (success) {
      printSubmit(submit);
    }
  });

await new Command()
  .command("ut", utCommand)
  .command("ot", otCommand)
  .command("submit", submitCommand)
  .parse(Deno.args);
