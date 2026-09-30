type ServerWithVariables = {
  url: string;
  variables?: Record<string, { default?: string }>;
};

/** Substitutes `{variable}` placeholders in a server URL with the variables' default values. */
export function replaceServerVariables(server: ServerWithVariables): string {
  let { url, variables } = server;
  if (variables) {
    for (const key in variables) {
      const defaultValue = variables[key].default;
      // An empty-string default is a legal substitution (e.g. an optional basePath).
      if (defaultValue !== undefined) {
        url = url.replaceAll(`{${key}}`, defaultValue);
      }
    }
  }
  return url;
}

/** The environment may hold either the raw (templated) or the substituted server URL — match both. */
export function serverMatchesUrl(server: ServerWithVariables, url: string | undefined): boolean {
  if (!url) {
    return false;
  }
  return server.url === url || replaceServerVariables(server) === url;
}
