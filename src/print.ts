import { colors } from "https://deno.land/x/cliffy@v0.25.7/ansi/colors.ts";
import { Cell, Table } from "https://deno.land/x/cliffy@v0.25.7/table/mod.ts";

import { SubmitData } from "./createSubmit.ts";
import { isWeekend } from "./isWeekend.ts";
import { formatDate } from "./formatDate.ts";

const createCellFunction = (table: Table) => (key: string, value: string) => {
  const dateCell = Cell.from(key);

  const hoursCell = Cell.from(value);
  hoursCell.align("right");

  table.push([dateCell, hoursCell]);
};

export const printSubmit = (data: SubmitData) => {
  const table = new Table();
  table.border(true);
  table.padding(1);
  table.indent(2);
  table.header(["Date", "Hours"]);

  const createCell = createCellFunction(table);

  data.forEach(({ date, data }) => {
    const value = String(data);
    const parsedDate = formatDate(date);

    if (isWeekend(date)) {
      createCell(parsedDate, "Weekend");
      return;
    }

    if (data === "sick") {
      createCell(colors.bgGreen(parsedDate), colors.green("Sick"));
      return;
    }

    if (data === "halfsick") {
      createCell(colors.bgGreen(parsedDate), colors.green("1/2 Sick"));
      return;
    }

    // Overhours
    if (data > 8) {
      createCell(colors.bgGreen(parsedDate), colors.green(value));
      return;
    }

    // Underhours
    if (data < 8) {
      createCell(colors.bgRed(parsedDate), colors.red(value));
      return;
    }

    createCell(parsedDate, value);
  });

  table.render();
};

export const printGreen = (text: string) => {
  console.log(colors.green(text));
};

export const printRed = (text: string) => {
  console.log(colors.red(text));
};
