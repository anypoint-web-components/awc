import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * This is a hack.
 * The `esbuild` used with tests ignores declaration files
 * and therefore while running tests there's a bunch of errors when the `index.ts`
 * exports interfaces. These were moved to the `types.ts` file for internal use 
 * but they should still be exported in the package.
 * 
 * This script adds the `export * from './types.js` to the generated js files.
 */
async function main() {
  const file = join('dist', 'index.d.ts');
  try {
    let contents = await readFile(file, 'utf8');
    if (contents.includes('./types')) {
      return;
    }
    contents += `export * from './types';\n`;
    await writeFile(file, contents);
  } catch (e) {
    console.warn(`Not adding types to dist/index.d.ts due to an error.`);
  }
}

main();
