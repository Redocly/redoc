'use strict';

import ApiInfo from './ApiInfo/api-info';
import JsonSchemaView from './JsonSchemaView/json-schema-view';
import Method from './Method/method.js';
import MethodsList from './MethodsList/methods-list';
import ParamsList from './ParamsList/params-list';
import Redoc from './Redoc/redoc';
import ResponsesList from './ResponsesList/responses-list';
import ResponsesSamples from './ResponsesSamples/responses-samples';
import SchemaSample from './SchemaSample/schema-sample';
import SideMenu from './SideMenu/side-menu';
import JsonSchema from './JsonSchema/json-schema';

const REDOC_COMPONENTS = [
  ApiInfo,
  JsonSchemaView,
  JsonSchema,
  Method,
  MethodsList,
  ParamsList,
  Redoc,
  ResponsesList,
  ResponsesSamples,
  SchemaSample,
  SideMenu
];

export {
  ApiInfo,
  JsonSchemaView,
  JsonSchema,
  Method,
  MethodsList,
  ParamsList,
  Redoc,
  ResponsesList,
  ResponsesSamples,
  SchemaSample,
  SideMenu,
  REDOC_COMPONENTS
};
