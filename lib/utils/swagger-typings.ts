import {
  Operation,
  Parameter,
  Schema,
  BodyParameter,
  HeaderParameter,
  QueryParameter,
  FormDataParameter,
  Spec,
  Response
} from '@types/swagger-schema-official';

export interface RedocInjectedPointer {
  _pointer?: string;
}


export interface SwaggerOperation extends Operation, RedocInjectedPointer {}
export interface SwaggerBodyParameter extends BodyParameter, RedocInjectedPointer {}
export interface SwaggerHeaderParameter extends HeaderParameter, RedocInjectedPointer {}
export interface SwaggerQueryParameter extends QueryParameter, RedocInjectedPointer {}
export interface SwaggerFormDataParameter extends FormDataParameter, RedocInjectedPointer {}
export type SwaggerParameter = SwaggerBodyParameter | SwaggerHeaderParameter | SwaggerQueryParameter | SwaggerFormDataParameter;
export interface SwaggerSchema extends Schema, RedocInjectedPointer {}
export { Spec as SwaggerSpec, Response as SwaggerResponse };
