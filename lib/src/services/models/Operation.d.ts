import { IMenuItem } from '../MenuStore';
import { GroupModel } from './Group.model';
import { SecurityRequirementModel } from './SecurityRequirement';
import { OpenAPIExternalDocumentation, OpenAPIServer, OpenAPIXCodeSample } from '../../types';
import { ContentItemModel, ExtendedOpenAPIOperation } from '../MenuBuilder';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';
import { RequestBodyModel } from './RequestBody';
import { ResponseModel } from './Response';
/**
 * Operation model ready to be used by components
 */
export declare class OperationModel implements IMenuItem {
    private parser;
    private operationSpec;
    private options;
    id: string;
    absoluteIdx?: number;
    name: string;
    description?: string;
    type: "operation";
    parent?: GroupModel;
    externalDocs?: OpenAPIExternalDocumentation;
    items: ContentItemModel[];
    depth: number;
    ready?: boolean;
    active: boolean;
    expanded: boolean;
    pointer: string;
    operationId?: string;
    httpVerb: string;
    deprecated: boolean;
    path: string;
    servers: OpenAPIServer[];
    security: SecurityRequirementModel[];
    codeSamples: OpenAPIXCodeSample[];
    constructor(parser: OpenAPIParser, operationSpec: ExtendedOpenAPIOperation, parent: GroupModel | undefined, options: RedocNormalizedOptions);
    /**
     * set operation as active (used by side menu)
     */
    activate(): void;
    /**
     * set operation as inactive (used by side menu)
     */
    deactivate(): void;
    expand(): void;
    collapse(): void;
    readonly requestBody: RequestBodyModel | undefined;
    readonly parameters: FieldModel[];
    readonly responses: ResponseModel[];
}
