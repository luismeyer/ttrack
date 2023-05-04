import { colors } from "https://deno.land/x/cliffy@v0.25.7/ansi/colors.ts";
import { Cell, Table } from "https://deno.land/x/cliffy@v0.25.7/table/mod.ts";

import { SubmitData } from "./createSubmit.ts";
import { isWeekend } from "./isWeekend.ts";
import { formatDate } from "./formatDate.ts";

export const printSubmit = (data: SubmitData) => {
  const table = new Table();
  table.border(true);
  table.padding(1);
  table.indent(2);
  table.header(["Date", "Hours"]);

  data.forEach(({ date, data }) => {
    let value = String(data);
    const parsedDate = formatDate(date);

    let key = parsedDate;

    if (data === "sick") {
      value = colors.green("Sick");
      key = colors.bgGreen(parsedDate);
    }

    // Overhours
    if (data !== "sick" && data > 8) {
      value = colors.green(value);
      key = colors.bgGreen(parsedDate);
    }

    // Underhours
    if (data !== "sick" && data < 8) {
      value = colors.red(value);
      key = colors.bgRed(parsedDate);
    }

    if (isWeekend(date)) {
      value = "Weekend";
      key = parsedDate;
    }

    const dateCell = Cell.from(key);

    const hoursCell = Cell.from(value);
    hoursCell.align("right");

    table.push([dateCell, hoursCell]);
  });

  table.render();
};

export const printGreen = (text: string) => {
  console.log(colors.green(text));
};

export const printRed = (text: string) => {
  console.log(colors.red(text));
};
