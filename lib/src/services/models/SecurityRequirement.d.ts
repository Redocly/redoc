import { OpenAPISecurityRequirement, OpenAPISecurityScheme } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
export interface SecurityScheme extends OpenAPISecurityScheme {
    id: string;
    sectionId: string;
    scopes: string[];
}
export declare class SecurityRequirementModel {
    schemes: SecurityScheme[];
    constructor(requirement: OpenAPISecurityRequirement, parser: OpenAPIParser);
}
