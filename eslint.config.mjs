import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import eslintPluginImportX from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import checkFile from 'eslint-plugin-check-file';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'check-file': checkFile,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        JSX: 'readonly',
      },
      parser: tseslint.parser,
      ecmaVersion: 12,
      sourceType: 'module',
    },
    settings: {
      react: {
        version: '19',
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['**/tsconfig.json'],
        }),
      ],
      jest: {
        version: 29,
      },
    },
    rules: {
      'jsx-runtime': 'off',
      'no-console': ['error', { allow: ['error', 'warn', 'info', 'time', 'timeEnd'] }],
      'import-x/export': 'off',
      'import-x/order': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/playwright/**',
            '**/vite.config.ts',
            '**/vitest.config.ts',
            '**/vitest.setup.ts',
            '**/__tests__/**/*.{ts,tsx}',
            '**/benchmarks/*.ts',
            '**/__mocks__/**/*.{ts,tsx}',
          ],
        },
      ],
      'import-x/default': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-children-prop': 'off',
      'prefer-const': 'off',
      'no-useless-escape': 'off',
      'no-fallthrough': 'off',
      'no-case-declarations': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
        },
      ],
      'no-multiple-empty-lines': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/*'],
              message: 'Import from src is not allowed',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  includeIgnoreFile(gitignorePath),
  {
    ignores: ['**/src/jotai/app.ts'],
  },
  {
    ignores: [
      '**/*.{js,cjs,mjs,jsx}',
      'eslint.config.mjs',
      'playwright.config.ts',
      '**/bundle/**/*',
      '**/lib/**/*',
      '**/playground/**/*',
      '**/node_modules/**/*',
    ],
  },
);
