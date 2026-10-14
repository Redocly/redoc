import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import react from '@vitejs/plugin-react';
import { bundleStats } from 'rollup-plugin-bundle-stats';

import pkg from './package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

const THEME_CANDIDATES = [
  process.env.REDOC_THEME_PATH && resolve(__dirname, process.env.REDOC_THEME_PATH),
  resolve(__dirname, 'node_modules/@redocly/theme/src'),
  resolve(__dirname, '../node_modules/@redocly/theme/src'),
  resolve(__dirname, '../../../node_modules/@redocly/theme/src'),
].filter((p): p is string => Boolean(p));

const THEME_PATH = THEME_CANDIDATES.find((p) => existsSync(p)) ?? THEME_CANDIDATES[0];

const require = createRequire(import.meta.url);
const FLEXSEARCH_DIST = dirname(require.resolve('flexsearch'));
// The monorepo hoists the catalog's js-yaml 4 next to openapi-core's 5; the published repo has
// one copy. Pin js-yaml to the copy openapi-core resolves so both builds carry one.
const JS_YAML_PATH = dirname(
  createRequire(require.resolve('@redocly/openapi-core')).resolve('js-yaml/package.json'),
);

const BANNER = `/** 
 * @license MIT
 * (c) Copyright 2026 Redocly LLC, all rights reserved.
 * -------------------------------------------------------------
 * Version: ${pkg.version}
 **/`;

// `@redocly/config` ships as one un-shakeable file; re-emitting its exports as independent
// literals lets tree-shaking keep only the constants the bundle reads.
const REDOCLY_CONFIG_ID = '\0redocly-config-literals';
const redoclyConfigLiterals = {
  name: 'redocly-config-literals',
  enforce: 'pre' as const,
  resolveId: (source: string) => (source === '@redocly/config' ? REDOCLY_CONFIG_ID : undefined),
  async load(id: string) {
    if (id !== REDOCLY_CONFIG_ID) return;
    const config = await import('@redocly/config');
    return Object.entries(config)
      .map(([name, value]) => {
        const literal = value instanceof RegExp ? value.toString() : JSON.stringify(value);
        return `export const ${name} = ${literal};`;
      })
      .join('\n');
  },
};

// Node resolves styled-components to its CJS build (no `exports` map), where the default import
// is `module.exports`, not `styled`; only the named export works there. The theme imports the
// default, so the library bundle's import is rewritten to the named binding.
const styledComponentsNamedImport = {
  name: 'styled-components-named-import',
  renderChunk: (code: string) =>
    code.replace(
      /import styled(?:\s*,\s*\{([^}]*)\})?\s*from\s*(["'])styled-components\2/,
      (_, named: string | undefined, quote: string) =>
        `import { styled${named ? `,${named}` : ''} } from ${quote}styled-components${quote}`,
    ),
};

// Bundled code reads only the package name and version; the rest of package.json stays out.
const PACKAGE_JSON_PATH = resolve(__dirname, 'package.json');
const packageJsonNameVersion = {
  name: 'package-json-name-version',
  enforce: 'pre' as const,
  load: (id: string) =>
    id === PACKAGE_JSON_PATH ? JSON.stringify({ name: pkg.name, version: pkg.version }) : undefined,
};

const LIBRARY_EXTERNALS = /^(react|react-dom|react-router|styled-components)(\/|$)/;

// Third-party code ships inlined in the bundles, so their licenses are checked on what each build
// actually bundles, not on the install tree. The per-bundle lists feed `npm run list:licenses`.
const ALLOWED_LICENSES = new Set([
  'MIT',
  'ISC',
  'Apache-2.0',
  'BSD',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'CC-BY-4.0',
  'CC0-1.0',
  'Python-2.0',
]);
const BUNDLED_LICENSES_DIR = resolve(__dirname, 'node_modules/.cache/bundled-licenses');

type Manifest = {
  name?: string;
  version?: string;
  license?: string | { type?: string };
  licenses?: { type?: string }[];
  repository?: string | { url?: string };
};

const manifests = new Map<string, Manifest>();
function readManifest(path: string): Manifest {
  let manifest = manifests.get(path);
  if (!manifest) {
    manifest = JSON.parse(readFileSync(path, 'utf8')) as Manifest;
    manifests.set(path, manifest);
  }
  return manifest;
}

/** Nearest `package.json` with a `name`; a nested `dist/esm/package.json` sets only the type. */
function findManifest(file: string): string | undefined {
  for (let dir = dirname(file); dir !== dirname(dir); dir = dirname(dir)) {
    const path = resolve(dir, 'package.json');
    if (existsSync(path) && readManifest(path).name) return path;
  }
  return undefined;
}

function licenseOf({ license, licenses }: Manifest): string {
  if (typeof license === 'string') return license;
  return license?.type ?? licenses?.map((entry) => entry.type).join(' OR ') ?? '';
}

/** An SPDX `OR` needs one allowed alternative; anything with `AND` needs every part allowed. */
function isAllowedLicense(expression: string): boolean {
  const flat = expression.replace(/[()]/g, '');
  return flat.includes(' AND ')
    ? flat.split(' AND ').every((part) => ALLOWED_LICENSES.has(part.trim()))
    : flat.split(' OR ').some((part) => ALLOWED_LICENSES.has(part.trim()));
}

const bundledLicenses = (bundleName: string) => ({
  name: 'bundled-licenses',
  generateBundle(
    this: { error(message: string): never },
    _options: unknown,
    bundle: Record<string, { type: string; modules?: Record<string, { renderedLength: number }> }>,
  ) {
    const paths = new Set<string>();
    for (const output of Object.values(bundle)) {
      // only modules with code in the output: a tree-shaken module ships nothing
      for (const [id, { renderedLength }] of Object.entries(output.modules ?? {})) {
        if (renderedLength === 0 || id.startsWith('\0')) continue;
        const path = findManifest(id.split('?')[0]);
        if (path && path !== PACKAGE_JSON_PATH) paths.add(path);
      }
    }
    const packages = [...paths]
      .map((path) => {
        const manifest = readManifest(path);
        const { repository } = manifest;
        return {
          name: manifest.name ?? '',
          version: manifest.version ?? '',
          license: licenseOf(manifest),
          repository: typeof repository === 'string' ? repository : repository?.url,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version));

    const rejected = packages.filter((entry) => !isAllowedLicense(entry.license));
    if (rejected.length > 0) {
      this.error(
        `${bundleName}: bundled packages with a license outside the allowlist: ` +
          rejected
            .map((entry) => `${entry.name}@${entry.version} (${entry.license || 'none'})`)
            .join(', '),
      );
    }
    mkdirSync(BUNDLED_LICENSES_DIR, { recursive: true });
    writeFileSync(
      resolve(BUNDLED_LICENSES_DIR, `${bundleName}.json`),
      JSON.stringify(packages, null, 2),
    );
  },
});

export default defineConfig(({ command, mode }) => {
  const isStandalone = mode === 'standalone';
  const entry = resolve(__dirname, isStandalone ? 'src/standalone.tsx' : 'src/index.ts');
  const baseFileName = isStandalone ? 'redoc.standalone' : 'redoc';

  return {
    plugins: [
      redoclyConfigLiterals,
      packageJsonNameVersion,
      bundledLicenses(baseFileName),
      react(),
      ...(isStandalone ? [] : [styledComponentsNamedImport]),
      ...(mode === 'analyze' ? [bundleStats()] : []),
    ],
    root: command === 'serve' ? resolve(__dirname, 'playground') : undefined,
    resolve: {
      dedupe: ['react', 'react-dom', 'react-router', '@redocly/openapi-core'],
      alias: {
        // openapi-core's assertion validator: reachable from `Config`, constructed only by
        // assertion rules, which the empty config never has. Exact specifiers: a bare
        // `@redocly/ajv` alias prefix-matches and would corrupt the subpath.
        '@redocly/ajv/dist/2020.js': resolve(__dirname, 'src/ajv-stub.js'),
        '@redocly/ajv/dist/draft4.js': resolve(__dirname, 'src/ajv-stub.js'),
        'ajv-formats': resolve(__dirname, 'src/ajv-stub.js'),
        '@redocly/theme': THEME_PATH,
        '@portal': resolve(THEME_PATH, 'mocks'),
        // Worker support lives only in the full bundle; the global build is what boots inside each worker.
        flexsearch: resolve(FLEXSEARCH_DIST, 'flexsearch.bundle.module.min.js'),
        'flexsearch-global?raw': `${resolve(FLEXSEARCH_DIST, 'flexsearch.bundle.min.js')}?raw`,
        crypto: resolve(__dirname, 'src/crypto-compat.js'),
        linkedom: resolve(__dirname, 'src/empty-linkedom.js'),
        'js-yaml': JS_YAML_PATH,
        picomatch: resolve(__dirname, 'src/empty.js'),
        '@opentelemetry/semantic-conventions': resolve(
          __dirname,
          'src/otel-semantic-conventions.js',
        ),
        path: 'path-browserify',
        'node:path': 'path-browserify',
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      // the theme alias points at TS source; pre-bundling it breaks module init order
      exclude: ['flexsearch-global?raw', '@redocly/theme'],
      include: [
        '@redocly/redoc-opentelemetry',
        'react-router',
        'lodash.throttle',
        'lodash.debounce',
        'copy-to-clipboard',
        'file-saver',
        'highlight-words-core',
        'nprogress',
        'zustand',
        'zustand/traditional',
        'use-sync-external-store/shim/with-selector',
      ],
      rolldownOptions: {
        resolve: {
          mainFields: ['module', 'main'],
        },
      },
    },
    define: {
      __REDOCLY_API_DOCS_VERSION__: JSON.stringify(pkg.version),
      __REDOCLY_API_DOCS_REVISION__: JSON.stringify(''),
      'process.env': '{}',
      'process.platform': '"browser"',
      'process.stdout': 'null',
      // Drives `isProd` in RedocTelemetry: shipped bundles report telemetry, `vite serve` does not.
      'process.env.NODE_ENV': JSON.stringify(command === 'build' ? 'production' : 'development'),
      ...(command === 'serve' && { SC_DISABLE_SPEEDY: 'false' }),
      // Escape hatch for checking telemetry during `vite serve`.
      'process.env.ENABLE_LOCAL_TELEMETRY': JSON.stringify(
        process.env.ENABLE_LOCAL_TELEMETRY ?? '',
      ),
      global: 'globalThis',
    },
    build: {
      outDir: resolve(__dirname, 'bundles'),
      emptyOutDir: false,
      // `npm run license:check` builds only to run the license check
      write: !process.env.LICENSE_CHECK,
      lib: {
        entry,
        fileName: baseFileName,
        formats: ['es'],
      },
      // minified afterwards by scripts/minify.js
      minify: false,
      rolldownOptions: {
        input: entry,
        external: isStandalone ? ['node-fetch'] : ['node-fetch', LIBRARY_EXTERNALS],
        output: {
          codeSplitting: false,
          entryFileNames: `${baseFileName}.js`,
          preserveModules: false,
          banner: BANNER,
        },
        // openapi-core is side-effect-free, so its unused config machinery can be tree-shaken
        treeshake: {
          moduleSideEffects: (id: string) => !id.includes('@redocly/openapi-core/'),
        },
      },
      target: 'esnext',
    },
    server: {
      port: 7800,
      open: true,
    },
  };
});
