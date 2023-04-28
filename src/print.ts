import { colors } from "https://deno.land/x/cliffy@v0.25.7/ansi/colors.ts";
import { Cell, Table } from "https://deno.land/x/cliffy@v0.25.7/table/mod.ts";

import { formatDateForPrint } from "./dateKey.ts";
import { SubmitData } from "./types.ts";

export const printSubmit = (data: SubmitData) => {
  const table = new Table();
  table.border(true);
  table.padding(1);
  table.indent(2);
  table.header(["Date", "Hours"]);

  data.forEach(({ date, hours }) => {
    let parsedHours = String(hours);
    let parsedDate = formatDateForPrint(date);

    // Overhours
    if (hours > 8) {
      parsedHours = colors.green(parsedHours);
      parsedDate = colors.bgGreen(parsedDate);
    }

    // Underhours
    if (hours < 8) {
      parsedHours = colors.red(parsedHours);
      parsedDate = colors.bgRed(parsedDate);
    }

    const dateCell = Cell.from(parsedDate);
    const hoursCell = Cell.from(parsedHours);
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
