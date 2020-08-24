import { OpenAPIParameter, Referenced } from '../../types';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { OpenAPIParser } from '../OpenAPIParser';
import { SchemaModel } from './Schema';
/**
 * Field or Parameter model ready to be used by components
 */
export declare class FieldModel {
    expanded: boolean;
    schema: SchemaModel;
    name: string;
    required: boolean;
    description: string;
    example?: string;
    deprecated: boolean;
    in?: string;
    kind: string;
    constructor(parser: OpenAPIParser, infoOrRef: Referenced<OpenAPIParameter> & {
        name?: string;
        kind?: string;
    }, pointer: string, options: RedocNormalizedOptions);
    toggle(): void;
}
