#!/usr/bin/env node
import esbuild from 'esbuild';
import fs from 'fs/promises';

async function* getFiles(path = `./`) {
  const entries = await fs.readdir(path, { withFileTypes: true });

  for (let file of entries) {
    if (file.isDirectory()) {
      yield* getFiles(`${path}${file.name}/`);
    } else {
      yield path + file.name;
    }
  }
}

const minifyOptions = {
  format: process.argv.indexOf('--cjs') > -1 ? 'cjs' : 'esm',
  minify: true,
  target: 'ESNext',
  platform: 'node',
  // if not set esbuild output crashes when used in node,
  // see https://github.com/nodejs/node/issues/45016
};

async function minifyFile(filePath) {
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const transformed = await esbuild.transform(fileContents, {
    ...minifyOptions,
    format:
      filePath.endsWith('.cjs') || filePath.includes('/compiled/') ? 'cjs' : minifyOptions.format,
  });
  return await fs.writeFile(filePath, transformed.code);
}

async function minifyDir(dir) {
  if (!dir.endsWith('/')) dir = dir + '/';
  let promises = [];

  await esbuild.initialize();

  try {
    for await (const filePath of getFiles(dir)) {
      if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
        promises.push(minifyFile(filePath));
      }
    }

    await Promise.all(promises);
  } catch (e) {
    console.error('Could not minify files:', e);
  }
}

await minifyDir(process.argv[2]);
