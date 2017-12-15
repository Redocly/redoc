import { OpenAPISecurityRequirement } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
import { SECURITY_SCHEMES_SECTION } from '../../utils/openapi';

export class SecurityRequirementModel {
  schemes: {
    id: string;
    sectionId: string;
    type: string;
    scopes: string[];
  }[];

  constructor(requirement: OpenAPISecurityRequirement, parser: OpenAPIParser) {
    const schemes = (parser.spec.components && parser.spec.components.securitySchemes) || {};

    this.schemes = Object.keys(requirement || {}).map(id => {
      const scheme = parser.deref(schemes[id]);
      const scopes = requirement[id] || [];
      return {
        id,
        sectionId: SECURITY_SCHEMES_SECTION + id,
        type: scheme.type,
        scopes,
      };
    });
  }
}
