import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/** @type {import('jest').Config} */
export default {
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  preset: 'ts-jest',
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/{index,types}.ts', '!src/events/*'],
  testPathIgnorePatterns: ['/node_modules/', '/bundle/', '/__mocks__/', '/src/icons/'],
  coverageThreshold: {
    global: {
      statements: 78,
      branches: 68,
      functions: 76,
      lines: 78,
    },
  },
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  coveragePathIgnorePatterns: [
    '\\.d\\.ts$',
    '/node_modules/',
    '__mock__',
    '/src/types/',
    '/src/icons/',
  ],
  modulePathIgnorePatterns: [
    '/__mocks__/',
    '/benchmark/',
    '/coverage/',
    'src/components/__tests__/mocks/*',
    'src/models/__tests__/helpers.ts',
    'src/icons/*',
    '/bundle/',
    'lib/',
    '/playground/',
    '/playwright/',
    '/scripts/',
  ],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        useESM: true,
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: '' } },
            },
          ],
        },
        tsconfig: {
          moduleResolution: 'node',
          module: 'ESNext',
          jsx: 'react-jsx',
        },
      },
    ],
    'node_modules/.pnpm/@redocly.+\\.js$': [
      'ts-jest',
      {
        isolatedModules: true,
        useESM: true,
        tsconfig: {
          moduleResolution: 'node',
          module: 'ESNext',
          allowJs: true,
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // Custom module mapper to handle @redocly packages
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/empty.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    `/node_modules/.pnpm/(?!vscode-languageserver-types|vscode-languageserver-textdocument|@redocly)`,
  ],
  prettierPath: require.resolve('prettier'),
};
