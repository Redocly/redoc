import { OpenAPIExample, OpenAPIMediaType } from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { SchemaModel } from './Schema';
import { OpenAPIParser } from '../OpenAPIParser';
export declare class MediaTypeModel {
    examples?: {
        [name: string]: OpenAPIExample;
    };
    schema?: SchemaModel;
    name: string;
    isRequestType: boolean;
    /**
     * @param isRequestType needed to know if skipe RO/RW fields in objects
     */
    constructor(parser: OpenAPIParser, name: string, isRequestType: boolean, info: OpenAPIMediaType, options: RedocNormalizedOptions);
    generateExample(parser: OpenAPIParser, info: OpenAPIMediaType): void;
}
