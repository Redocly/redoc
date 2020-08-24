import { OpenAPIRequestBody, Referenced } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
import { MediaContentModel } from './MediaContent';
export declare class RequestBodyModel {
    description: string;
    required: boolean;
    content?: MediaContentModel;
    constructor(parser: OpenAPIParser, infoOrRef: Referenced<OpenAPIRequestBody>, options: RedocNormalizedOptions);
}
