import { OpenAPIResponse, Referenced } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { FieldModel } from './Field';
import { MediaContentModel } from './MediaContent';
export declare class ResponseModel {
    expanded: boolean;
    content?: MediaContentModel;
    code: string;
    summary: string;
    description: string;
    type: string;
    headers: FieldModel[];
    constructor(parser: OpenAPIParser, code: string, defaultAsError: boolean, infoOrRef: Referenced<OpenAPIResponse>, options: RedocNormalizedOptions);
    toggle(): void;
}
