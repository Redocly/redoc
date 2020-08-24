import { OpenAPIExternalDocumentation, OpenAPISpec } from '../types';
import { ContentItemModel } from './MenuBuilder';
import { ApiInfoModel } from './models/ApiInfo';
import { SecuritySchemesModel } from './models/SecuritySchemes';
import { OpenAPIParser } from './OpenAPIParser';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';
/**
 * Store that containts all the specification related information in the form of tree
 */
export declare class SpecStore {
    private options;
    parser: OpenAPIParser;
    info: ApiInfoModel;
    externalDocs?: OpenAPIExternalDocumentation;
    contentItems: ContentItemModel[];
    securitySchemes: SecuritySchemesModel;
    constructor(spec: OpenAPISpec, specUrl: string | undefined, options: RedocNormalizedOptions);
}
