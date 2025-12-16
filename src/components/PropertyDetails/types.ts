import type { TFunction } from '@redocly/theme/core/openapi';
import type { ReactElement } from 'react';
import type { SchemaOptions, OneOfChangeParams } from '../Schema/index.js';
import type { FieldModel } from '../../models/index.js';

export interface EnumValuesProps {
  values?: string[] | { [name: string]: string };
  type: string | string[];
}

export interface SimpleEnumsProps {
  enums: string[];
  toggle: () => void;
  showToggleButton: boolean;
  toggleButtonText: string;
  type: string | string[];
  translate: TFunction;
}

export type DescriptionEnumProp = Array<{ value: string; description: string }>;

export interface DescriptionEnumsProps {
  enums: DescriptionEnumProp;
  toggle: () => void;
  showToggleButton: boolean;
  toggleButtonText: string;
  type: string | string[];
  translate: TFunction;
}

export interface ExtensionsProps {
  extensions: {
    [k: string]: string | Record<string, unknown>;
  };
}

export interface FieldProps extends SchemaOptions {
  isFirst?: boolean;
  isLast?: boolean;

  field: FieldModel;
  expandByDefault?: boolean;

  renderDiscriminatorSwitch?: () => ReactElement;
  deepLink?: string;
  slug?: string;
  fieldParentsName?: string[];

  disableDeepLinks?: boolean;
  oneOfLevel?: number;
  onOneOfChange?: ({ pointer, index }: OneOfChangeParams) => void;
}
