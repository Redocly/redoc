import { OpenAPIExample, Referenced } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';
export declare class ExampleModel {
    value: any;
    summary?: string;
    description?: string;
    externalValue?: string;
    constructor(parser: OpenAPIParser, infoOrRef: Referenced<OpenAPIExample>);
}
