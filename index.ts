import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";

import { createDateKey, formatDateKey } from "./dateKey.ts";
import { initStore } from "./initStore.ts";
import { periodDates } from "./periodDates.ts";
import { printGreen, printRed, printSubmit } from "./print.ts";

const DEFAULT_HOURS = 8;

const store = initStore();

const key = createDateKey(new Date());

const utCommand = new Command()
  .description("Register undertime.")
  .arguments("<amount:integer>")
  .action((_options, amount) => {
    if (amount === undefined) {
      return;
    }

    store[key] = DEFAULT_HOURS - amount;
    printRed(`Time set to ${store[key]} hours.`);
  });

const otCommand = new Command()
  .description("Register overtime.")
  .arguments("<amount:integer>")
  .action((_options, amount) => {
    if (amount === undefined) {
      return;
    }

    store[key] = DEFAULT_HOURS + amount;
    printGreen(`Time set to ${store[key]} hours.`);
  });

const submitCommand = new Command()
  .description("Print times for this period.")
  .action(() => {
    const keys = periodDates(new Date());

    const output = keys.map((key) => ({
      date: formatDateKey(key),
      hours: store[key] ?? DEFAULT_HOURS,
    }));

    printSubmit(output);
  });

await new Command()
  .command("ut", utCommand)
  .command("ot", otCommand)
  .command("submit", submitCommand)
  .parse(Deno.args);
