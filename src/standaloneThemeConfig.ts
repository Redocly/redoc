import type { ThemeDataTransferObject } from '@redocly/theme/core/openapi';

/** Community edition: hides theme UI that needs a portal backend — the code-block report button and all generic page actions. Only the spec-driven x-mcp connect actions remain. */
export const STANDALONE_THEME_CONFIG: ThemeDataTransferObject['config'] | undefined = {
  codeSnippet: { report: { hide: true } },
  // valid PageActionType values at runtime, but absent from the config items union
  navigation: { actions: { items: ['mcp-cursor', 'mcp-vscode'] } },
} as unknown as ThemeDataTransferObject['config'];
