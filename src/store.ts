import os from "https://deno.land/x/dos@v0.11.0/mod.ts";
import { existsSync } from "https://deno.land/std@0.184.0/fs/mod.ts";

const APP_DATA_DIR = os.homeDir() + "/Library/Application Support/ttrack";

const FILE_PATH = `${APP_DATA_DIR}/store.json`;

export type Day = "sick" | "halfsick" | number;

export type Store = Record<string, Day | undefined>;

const writeStore = (json: Store) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(json ?? {}));

  Deno.writeFileSync(FILE_PATH, data);
};

const readStore = (): Store => {
  const fileContent = Deno.readTextFileSync(FILE_PATH);

  return JSON.parse(fileContent);
};

const setupFiles = () => {
  if (!existsSync(APP_DATA_DIR)) {
    Deno.mkdirSync(APP_DATA_DIR);
  }

  if (!existsSync(FILE_PATH)) {
    writeStore({});
  }
};

const initStore = () => {
  setupFiles();

  // this holds the json value during runtime
  const jsonVar = readStore();

  return new Proxy(jsonVar, {
    get: (target, key, receiver) => Reflect.get(target, key, receiver),

    set: (target, key, value, receiver) => {
      const input = value !== "" ? value : undefined;

      // don't know what to do
      if (typeof key === "symbol") {
        return false;
      }

      // capture the old value before update
      const oldValue = target[key];

      // update the proxy and the object
      const success = Reflect.set(target, key, input, receiver);

      if (success && oldValue !== input) {
        // persist new value in file
        writeStore(target);
      }

      return success;
    },
  });
};

export const store = initStore();
