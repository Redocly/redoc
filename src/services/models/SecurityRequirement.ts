import { OpenAPISecurityRequirement } from '../../types';
import { SECURITY_SCHEMES_SECTION } from '../../utils/openapi';
import { OpenAPIParser } from '../OpenAPIParser';

export interface SecurityScheme {
  id: string;
  sectionId: string;
  type: string;
  scopes: string[];
}

export class SecurityRequirementModel {
  schemes: SecurityScheme[];

  constructor(requirement: OpenAPISecurityRequirement, parser: OpenAPIParser) {
    const schemes = (parser.spec.components && parser.spec.components.securitySchemes) || {};

    this.schemes = Object.keys(requirement || {})
      .map(id => {
        const scheme = parser.deref(schemes[id]);
        const scopes = requirement[id] || [];

        if (!scheme) {
          console.warn(`Non existing security scheme referenced: ${id}. Skipping`);
          return undefined;
        }

        return {
          id,
          sectionId: SECURITY_SCHEMES_SECTION + id,
          type: scheme.type,
          scopes,
        };
      })
      .filter(scheme => scheme !== undefined) as SecurityScheme[];
  }
}
