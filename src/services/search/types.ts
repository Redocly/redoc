import type {
  OperationParameter,
  ParameterHighlight as ThemeParameterHighlight,
} from '@redocly/theme/core/openapi';
import type { ItemBadge } from '@redocly/config';
import type { RouteKind } from '../../utils/routeKind.js';

export type ParameterHighlight = ThemeParameterHighlight & {
  enum?: string;
  example?: string;
};

export type SearchDocument = {
  id: string;
  url: string;
  title: string | string[];
  text: string | string[];
  path?: string[];
  httpMethod?: string;
  httpPath?: string | string[];
  isAdditionalOperation?: boolean;
  isSchemaDefinition?: boolean;
  deprecated?: boolean;
  security?: string[];
  parameters?: OperationParameter[];
  badges?: ItemBadge[];
  kind?: RouteKind;
};

export type SearchItemData = {
  document: SearchDocument;
  highlight: Record<string, string> & { parameters?: ParameterHighlight[]; path?: string[] };
};

export type { OperationParameter } from '@redocly/theme/core/openapi';
export type { ItemBadge } from '@redocly/config';
