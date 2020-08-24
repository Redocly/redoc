import { OpenAPIExternalDocumentation, OpenAPISchema, Referenced } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';
import { MergedOpenAPISchema } from '../';
export declare class SchemaModel {
    private options;
    pointer: string;
    type: string;
    displayType: string;
    typePrefix: string;
    title: string;
    description: string;
    externalDocs?: OpenAPIExternalDocumentation;
    isPrimitive: boolean;
    isCircular: boolean;
    format?: string;
    displayFormat?: string;
    nullable: boolean;
    deprecated: boolean;
    pattern?: string;
    example?: any;
    enum: any[];
    default?: any;
    readOnly: boolean;
    writeOnly: boolean;
    constraints: string[];
    fields?: FieldModel[];
    items?: SchemaModel;
    oneOf?: SchemaModel[];
    oneOfType: string;
    discriminatorProp: string;
    activeOneOf: number;
    rawSchema: OpenAPISchema;
    schema: MergedOpenAPISchema;
    /**
     * @param isChild if schema discriminator Child
     * When true forces dereferencing in allOfs even if circular
     */
    constructor(parser: OpenAPIParser, schemaOrRef: Referenced<OpenAPISchema>, pointer: string, options: RedocNormalizedOptions, isChild?: boolean);
    /**
     * Set specified alternative schema as active
     * @param idx oneOf index
     */
    activateOneOf(idx: number): void;
    init(parser: OpenAPIParser, isChild: boolean): void;
    private initOneOf;
    private initDiscriminator;
}
