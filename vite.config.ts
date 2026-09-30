import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { existsSync } from 'fs';
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

const FLEXSEARCH_DIST = dirname(createRequire(import.meta.url).resolve('flexsearch'));

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

export default defineConfig(({ command, mode }) => {
  const isStandalone = mode === 'standalone';
  const entry = resolve(__dirname, isStandalone ? 'src/standalone.tsx' : 'src/index.ts');
  const baseFileName = isStandalone ? 'redoc.standalone' : 'redoc';

  return {
    plugins: [
      redoclyConfigLiterals,
      react(),
      ...(isStandalone ? [] : [styledComponentsNamedImport]),
      ...(mode === 'analyze' ? [bundleStats()] : []),
    ],
    root: command === 'serve' ? resolve(__dirname, 'playground') : undefined,
    resolve: {
      dedupe: [
        'react',
        'react-dom',
        'react-router',
        '@redocly/ajv',
        'yaml',
        '@redocly/openapi-core',
      ],
      alias: {
        ajv: '@redocly/ajv',
        '@redocly/theme': THEME_PATH,
        '@portal': resolve(THEME_PATH, 'mocks'),
        // Worker support lives only in the full bundle; the global build is what boots inside each worker.
        flexsearch: resolve(FLEXSEARCH_DIST, 'flexsearch.bundle.module.min.js'),
        'flexsearch-global?raw': `${resolve(FLEXSEARCH_DIST, 'flexsearch.bundle.min.js')}?raw`,
        crypto: resolve(__dirname, 'src/crypto-compat.js'),
        linkedom: resolve(__dirname, 'src/empty-linkedom.js'),
        yaml: resolve(__dirname, 'src/yaml-compat.js'),
        picomatch: resolve(__dirname, 'src/empty.js'),
        '@opentelemetry/semantic-conventions': resolve(
          __dirname,
          'src/otel-semantic-conventions.js',
        ),
        path: 'path-browserify',
        'node:path': 'path-browserify',
        buffer: 'buffer',
        http: resolve(__dirname, 'src/empty.js'),
        url: resolve(__dirname, 'src/url-compat.ts'),
        fs: resolve(__dirname, 'src/empty.js'),
        os: resolve(__dirname, 'src/empty.js'),
        tty: resolve(__dirname, 'src/empty.js'),
        'node-fetch': resolve(__dirname, 'src/empty.js'),
        'node-fetch-h2': resolve(__dirname, 'src/empty.js'),
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
      lib: {
        entry,
        fileName: baseFileName,
        formats: ['es'],
      },
      // minified afterwards by scripts/minify.js
      minify: false,
      rolldownOptions: {
        input: entry,
        external: isStandalone
          ? ['node-fetch']
          : ['node-fetch', 'react', 'react-dom', 'react/jsx-runtime', 'styled-components'],
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
