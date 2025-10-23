import type { OperationParameter, ParameterHighlight } from '@redocly/theme/core/openapi';
import type { ItemBadge } from '@redocly/config';

export type SearchDocument = {
  id: string;
  url: string;
  title: string | string[];
  text: string | string[];
  path?: string[];
  httpMethod?: string;
  httpPath?: string | string[];
  deprecated?: boolean;
  security?: string[];
  parameters?: OperationParameter[];
  badges?: ItemBadge[];
};

export type SearchItemData = {
  document: SearchDocument;
  highlight: Record<string, string> & { parameters?: ParameterHighlight[]; path?: string[] };
};

export type { OperationParameter, ParameterHighlight } from '@redocly/theme/core/openapi';
export type { ItemBadge } from '@redocly/config';
