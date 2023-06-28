import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";

import { createSubmit } from "./createSubmit.ts";
import { createDateKey } from "./dateKey.ts";
import { parseDateInput } from "./parseDate.ts";
import { printGreen, printRed, printSubmit } from "./print.ts";
import { store } from "./store.ts";
import { formatDate } from "./formatDate.ts";

export const DEFAULT_HOURS = 8;

const undertimeCommand = new Command()
  .description("Register undertime")
  .option("-d, --date <date:string>", "Date to register change.")
  .arguments("<amount:integer>")
  .action(({ date }, amount) => {
    if (amount === undefined) {
      return;
    }

    const parsedDate = parseDateInput(date);
    const key = createDateKey(parsedDate);

    store[key] = DEFAULT_HOURS - amount;

    printRed(`${formatDate(parsedDate)} => Time set to ${store[key]} hours.`);
  });

const overtimeCommand = new Command()
  .description("Register overtime")
  .option("-d, --date <date:string>", "Date to register change.")
  .arguments("<amount:integer>")
  .action(({ date }, amount) => {
    if (amount === undefined) {
      return;
    }

    const parsedDate = parseDateInput(date);
    const key = createDateKey(parsedDate);

    store[key] = DEFAULT_HOURS + amount;
    printGreen(`${formatDate(parsedDate)} => Time set to ${store[key]} hours.`);
  });

const submitCommand = new Command()
  .description("Print times for this period")
  .option("-d, --date <date:string>", "Date to find submit period.")
  .action(({ date }) => {
    const inputDate = parseDateInput(date);

    const submit = createSubmit(inputDate);

    printSubmit(submit);
  });

const sickCommand = new Command()
  .description("Set sick for the day")
  .option("-d, --date <date:string>", "Date to update.")
  .option("-a, --halfday", "If only half of the day should be set to sick.")
  .action(({ date, halfday }) => {
    const parsedDate = parseDateInput(date);
    const key = createDateKey(parsedDate);

    const state = halfday ? "halfsick" : "sick";
    store[key] = state;

    printGreen(`${formatDate(parsedDate)} => Set status to ${state}.`);
  });

await new Command()
  .command("u", undertimeCommand)
  .command("o", overtimeCommand)
  .command("s", sickCommand)
  .command("sub", submitCommand)
  .parse(Deno.args);
