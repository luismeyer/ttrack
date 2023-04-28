import * as path from "https://deno.land/std@0.102.0/path/mod.ts";

export const relativePath = (relPath: string) => {
  const mainModuleDir = path.dirname(path.fromFileUrl(Deno.mainModule));

  return path.resolve(mainModuleDir, relPath);
};
