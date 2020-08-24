import { OpenAPIMediaType } from '../../types';
import { MediaTypeModel } from './MediaType';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';
/**
 * MediaContent model ready to be sued by React components
 * Contains multiple MediaTypes and keeps track of the currently active one
 */
export declare class MediaContentModel {
    parser: OpenAPIParser;
    isRequestType: boolean;
    mediaTypes: MediaTypeModel[];
    activeMimeIdx: number;
    /**
     * @param isRequestType needed to know if skipe RO/RW fields in objects
     */
    constructor(parser: OpenAPIParser, info: Dict<OpenAPIMediaType>, isRequestType: boolean, options: RedocNormalizedOptions);
    /**
     * Set active media type by index
     * @param idx media type index
     */
    activate(idx: number): void;
    readonly active: MediaTypeModel;
    readonly hasSample: boolean;
}
