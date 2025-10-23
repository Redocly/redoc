import type { SecurityDetails } from '../types/index.js';

import { SecurityVariablesEnvSuffix } from '@redocly/theme/core/openapi';

import { escapeFormId } from './string.js';
import { fromSessionStorage, toSessionStorage } from './session-storage.js';

export function setSecurityDetailsVariants(
  name: string,
  variants: { label: string; details: SecurityDetails | string }[],
): void {
  name = escapeFormId(name);
  toSessionStorage(`auth.${name}.variants`, JSON.stringify(variants));

  // if (typeof details === 'string') {
  //   toStorage('auth.' + name, details);
  //   // Write to storage all data for first time or for selected security only
  // } else if (details) {
  //   toStorage(`auth.${name}.password`, details.password || '');
  //   toStorage(`auth.${name}.username`, details.username || '');
  //   toStorage(`auth.${name}.token`, (details.token && JSON.stringify(details.token)) || '');
  //   toStorage(`auth.${name}.client_id`, details.client_id || '');
  //   toStorage(`auth.${name}.client_secret`, details.client_secret || '');
  //   toStorage(`auth.${name}.scopes`, (details.scopes && JSON.stringify(details.scopes)) || '');
  // }
}

export function getSecurityDetails(
  name: string,
  environment: Record<string, string> = {},
): SecurityDetails & { raw: string } {
  return {
    raw: environment[name + SecurityVariablesEnvSuffix.APIKey],
    password: environment[name + SecurityVariablesEnvSuffix.Password],
    username: environment[name + SecurityVariablesEnvSuffix.Username],
    token: environment[name + SecurityVariablesEnvSuffix.Token]
      ? {
          access_token: environment[name + SecurityVariablesEnvSuffix.Token],
        }
      : undefined,
    client_id: environment[name + SecurityVariablesEnvSuffix.ClientId],
    client_secret: environment[name + SecurityVariablesEnvSuffix.ClientSecret],
    scopes: fromSessionStorage(`auth.${name}.scopes`), // TODO
  };
}

export function setSecurityDetails(name: string, details: SecurityDetails | string): void {
  name = escapeFormId(name);
  if (typeof details === 'string') {
    toSessionStorage('auth.' + name, details);
    // Write to storage all data for first time or for selected security only
  } else if (details) {
    toSessionStorage(`auth.${name}.password`, details.password || '');
    toSessionStorage(`auth.${name}.username`, details.username || '');
    toSessionStorage(`auth.${name}.token`, (details.token && JSON.stringify(details.token)) || '');
    toSessionStorage(`auth.${name}.client_id`, details.client_id || '');
    toSessionStorage(`auth.${name}.client_secret`, details.client_secret || '');
    toSessionStorage(
      `auth.${name}.scopes`,
      (details.scopes && JSON.stringify(details.scopes)) || '',
    );
  }
}
