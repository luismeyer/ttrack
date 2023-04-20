import { ParseError } from "./parseArgs.ts";

export const gracefulExit = (main: () => void) => {
  return () => {
    try {
      main();
    } catch (error) {
      // Gracefully handle parsing errors
      if (error instanceof ParseError) {
        console.error(`%c${error.name}: ${error.message}`, "color: red");

        return;
      }

      throw error;
    }
  };
};
