import { parse } from "https://deno.land/std@0.182.0/datetime/mod.ts";

const dayFormats = ["d", "dd"];
const monthFormats = ["M", "MM"];
const yearFormats = ["yy", "yyyy"];

let formats: string[] = [];

dayFormats.forEach((day) => {
  monthFormats.forEach((month) => {
    yearFormats.forEach((year) => {
      formats = [
        ...formats,
        `${day}.${month}.${year}`,
        `${day}-${month}-${year}`,
      ];
    });
  });
});

const gracefulParse = (date: string, format: string) => {
  try {
    return parse(date, format);
  } catch {
    // Ignore
    return undefined;
  }
};

export const parseDate = (input?: string): Date | undefined => {
  if (!input) {
    return;
  }

  return formats.map((format) => gracefulParse(input, format)).find(Boolean);
};
