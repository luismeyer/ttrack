import * as path from "https://deno.land/std@0.102.0/path/mod.ts";
import { existsSync } from "https://deno.land/std@0.184.0/fs/mod.ts";

export const mainModuleDir = path.dirname(path.fromFileUrl(Deno.mainModule));

const FILE_PATH = path.resolve(mainModuleDir, "./store.json");

type Store = Record<string, number | undefined>;

const readJson = (): Store => {
  const fileContent = Deno.readTextFileSync(FILE_PATH);

  return JSON.parse(fileContent);
};

const writeFileSync = (json: Store) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(json ?? {}));

  Deno.writeFileSync(FILE_PATH, data);
};

export const initStore = () => {
  existsSync;
  if (!existsSync(FILE_PATH)) {
    writeFileSync({});
  }

  // this holds the json value during runtime
  const jsonVar = readJson();

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
        writeFileSync(target);
      }

      return success;
    },
  });
};
