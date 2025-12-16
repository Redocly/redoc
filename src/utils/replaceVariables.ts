import type { OpenAPIServer } from '../types/index.js';

export function replaceVariables(server: OpenAPIServer): string {
  let { url, variables } = server;

  if (variables) {
    for (const key in variables) {
      const variable = variables[key];
      if (variable.default) {
        const regex = new RegExp(`{${key}}`, 'g');
        url = url.replace(regex, variable.default);
      }
    }
  }

  return url;
}
