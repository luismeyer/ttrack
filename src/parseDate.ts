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

export const parseDateInput = (input?: string): Date => {
  if (!input) {
    return new Date();
  }

  const date = formats
    .map((format) => gracefulParse(input, format))
    .find(Boolean);

  if (!date) {
    throw new Error(`Could not parse date: ${input}`);
  }

  return date;
};
