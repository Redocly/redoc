import { OpenAPISecurityScheme, Referenced } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
export declare class SecuritySchemeModel {
    id: string;
    sectionId: string;
    type: OpenAPISecurityScheme['type'];
    description: string;
    apiKey?: {
        name: string;
        in: OpenAPISecurityScheme['in'];
    };
    http?: {
        scheme: string;
        bearerFormat?: string;
    };
    flows: OpenAPISecurityScheme['flows'];
    openId?: {
        connectUrl: string;
    };
    constructor(parser: OpenAPIParser, id: string, scheme: Referenced<OpenAPISecurityScheme>);
}
export declare class SecuritySchemesModel {
    schemes: SecuritySchemeModel[];
    constructor(parser: OpenAPIParser);
}
