#!/usr/bin/env node
import { minify, parseSync } from 'rolldown/utils';
import fs from 'fs/promises';

/**
 * Re-bundlers rename module-scope bindings, so the module body is moved into a closure
 * and only imports and the trailing `export { … }` stay at module scope. Returns the
 * wrapped code and the module-scope names to reserve from mangling.
 */
function wrapModuleBody(filePath, code) {
  const { program } = parseSync(filePath, code);
  const imports = program.body.filter((node) => node.type === 'ImportDeclaration');
  const exports = program.body.filter((node) => node.type === 'ExportNamedDeclaration');
  const last = program.body[program.body.length - 1];
  if (exports.length !== 1 || exports[0] !== last || exports[0].declaration) {
    throw new Error(`${filePath}: expected a single trailing \`export { … }\` statement`);
  }
  if (imports.some((node) => node.start > exports[0].start)) {
    throw new Error(`${filePath}: imports after the export statement are not supported`);
  }
  // keep the leading @license banner ahead of the closure
  const bodyStart = imports.length
    ? Math.max(...imports.map((node) => node.end))
    : program.body[0].start;
  const importLocals = imports.flatMap((node) =>
    node.specifiers.map((specifier) => specifier.local.name),
  );
  const locals = exports[0].specifiers
    .map((specifier) => specifier.local.name)
    .filter((name) => !importLocals.includes(name));
  const head = code.slice(0, bodyStart);
  const body = code.slice(bodyStart, last.start);
  const exportStatement = code.slice(last.start);
  return {
    code:
      `${head}\nconst { ${locals.join(', ')} } = (() => {${body}\n` +
      `return { ${locals.join(', ')} };\n})();\n${exportStatement}`,
    reserved: [...new Set([...importLocals, ...locals])],
  };
}

async function* getFiles(path = './') {
  const entries = await fs.readdir(path, { withFileTypes: true });

  for (const file of entries) {
    if (file.isDirectory()) {
      yield* getFiles(`${path}${file.name}/`);
    } else {
      yield path + file.name;
    }
  }
}

// no sourceMappingURL is emitted; the maps ship out-of-band via `npm run pack:sourcemaps`
const emitSourcemaps = process.argv.indexOf('--sourcemaps') > -1;

// openapi-core's walk() declares `from = currentLocation.source.absoluteRef` as a
// default parameter; downstream manglers mis-bind that reference after renaming, so
// it is rewritten into an ordinary body assignment before minifying.
const FRAGILE_DEFAULT_PARAM =
  'const resolve = (ref, from = currentLocation.source.absoluteRef) => {';
const SAFE_DEFAULT_PARAM =
  'const resolve = (ref, from) => {\n\t\t\tfrom = from ?? currentLocation.source.absoluteRef;';

let fragileDefaultParamMatches = 0;

async function minifyFile(filePath) {
  let fileContents = await fs.readFile(filePath, 'utf-8');
  const rewritten = fileContents.replaceAll(FRAGILE_DEFAULT_PARAM, SAFE_DEFAULT_PARAM);
  if (rewritten.length !== fileContents.length) {
    fragileDefaultParamMatches += 1;
  }
  const wrapped = wrapModuleBody(filePath, rewritten);
  const result = await minify(filePath, wrapped.code, {
    module: true,
    mangle: { toplevel: false, reserved: wrapped.reserved },
    sourcemap: emitSourcemaps,
    // legal comments default to 'none' when minifying — keep the @license banner
    codegen: { legalComments: 'inline' },
  });
  if (result.errors.length > 0) {
    throw new Error(`Could not minify ${filePath}:\n${result.errors.join('\n')}`);
  }
  if (emitSourcemaps && result.map) {
    await fs.writeFile(`${filePath}.map`, JSON.stringify(result.map));
  }
  return fs.writeFile(filePath, result.code);
}

async function minifyDir(dir) {
  if (!dir.endsWith('/')) dir += '/';

  // sequential: concurrency multiplies peak memory
  for await (const filePath of getFiles(dir)) {
    if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      await minifyFile(filePath);
    }
  }
}

await minifyDir(process.argv[2]);
if (fragileDefaultParamMatches === 0) {
  throw new Error(
    'The openapi-core resolve() default-parameter pattern was not found in any bundle. ' +
      'Update FRAGILE_DEFAULT_PARAM in scripts/minify.js, or delete the rewrite if openapi-core no longer needs it.',
  );
}
