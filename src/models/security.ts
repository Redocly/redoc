import type {
  OpenAPISecurityRequirement,
  OpenAPISecurityScheme,
  Referenced,
} from '../types/index.js';
import type { OpenAPIParser } from '../services/index.js';
import type {
  SecurityRequirement,
  ExtendedOpenAPISecurityScheme,
  SecurityScheme,
} from './types.js';

import { getValueFromMdParsedExtension } from '../utils/index.js';

type GetSecurityRequirementsInput = {
  requirement: OpenAPISecurityRequirement;
  parser: OpenAPIParser;
};

export function getSecurity(
  requirements: OpenAPISecurityRequirement[] = [],
  parser: OpenAPIParser,
): SecurityRequirement[] {
  return requirements
    .map((requirement) => getSecurityRequirement({ requirement, parser }))
    .filter(({ schemes }) => schemes.length > 0);
}

function getSecurityRequirement({
  requirement,
  parser,
}: GetSecurityRequirementsInput): SecurityRequirement {
  const schemes =
    (parser.definition.components && parser.definition.components.securitySchemes) || {};

  const filteredSchemes = Object.keys(requirement || {})
    .map((id) => {
      const scheme = parser.deref(schemes[id]).resolved;
      const scopes = requirement[id] || [];

      if (!scheme) {
        return undefined;
      }

      return {
        ...scheme,
        id,
        sectionId: id,
        scopes,
      };
    })
    .filter(Boolean) as ExtendedOpenAPISecurityScheme[];

  return {
    schemes: filteredSchemes,
  };
}

export function getSecurityScheme(
  parser: Partial<OpenAPIParser>,
  id: string,
  scheme: Referenced<OpenAPISecurityScheme>,
): SecurityScheme {
  if (!parser?.deref) {
    return {} as SecurityScheme;
  }

  const { resolved: info } = parser.deref(scheme);

  const sectionId = id;
  const type = info.type;
  const description = getValueFromMdParsedExtension(info, 'description') || '';
  let apiKey: SecurityScheme['apiKey'] = undefined;
  let http: SecurityScheme['http'] = undefined;
  let openId: SecurityScheme['openId'] = undefined;
  let flows: SecurityScheme['flows'] = {};

  switch (info.type) {
    case 'apiKey': {
      apiKey = {
        name: info.name as string,
        in: info.in,
      };
      break;
    }
    case 'http': {
      http = {
        scheme: info.scheme as string,
        bearerFormat: info.bearerFormat,
      };
      break;
    }
    case 'openIdConnect': {
      openId = {
        connectUrl: info.openIdConnectUrl as string,
      };
      break;
    }
    case 'oauth2': {
      flows = info.flows;
      break;
    }
  }

  return {
    id,
    sectionId,
    type,
    description,
    apiKey,
    http,
    flows,
    openId,
  };
}

export function getSecuritySchemes({
  parser,
}: {
  parser: Partial<OpenAPIParser>;
}): Array<SecurityScheme> {
  if (!parser) {
    return [];
  }
  const schemes = parser.definition?.components?.securitySchemes || {};

  return Object.keys(schemes).map((name) => getSecurityScheme(parser, name, schemes[name]));
}
