import { OpenAPIContact, OpenAPIInfo, OpenAPILicense } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
export declare class ApiInfoModel implements OpenAPIInfo {
    private parser;
    title: string;
    version: string;
    description: string;
    termsOfService?: string;
    contact?: OpenAPIContact;
    license?: OpenAPILicense;
    constructor(parser: OpenAPIParser);
    readonly downloadLink: string | undefined;
    readonly downloadFileName: string | undefined;
}
