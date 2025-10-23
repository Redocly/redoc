import type { ExampleModel, OperationModel, SchemaModel } from '../../models/index.js';

export interface SchemaOptions {
  showTitle?: boolean;
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  level?: number;
  examples?: { [name: string]: ExampleModel };
  operation?: OperationModel;
}

export interface SchemaProps extends SchemaOptions {
  schema: SchemaModel;
  parentType?: string[] | string;
  onDiscriminatorChange?: (idx: number) => void;
  onOneOfChange?: (params: OneOfChangeParams) => void;
  fieldParentsName?: string[];
  expandable?: boolean;
  deepLink?: string;
  slug?: string;
  required?: boolean;
  disableDeepLinks?: boolean;
  oneOfLevel?: number;
  shouldCloseArray?: boolean;
}

export interface ObjectSchemaProps extends Omit<SchemaProps, 'onDiscriminatorChange'> {
  discriminator?: {
    fieldName: string;
    parentSchema: SchemaModel;
    activeOneOfIdx: number;
    onChange?: (idx: number) => void;
  };
  fieldParentsName?: string[];
  expandable?: boolean;
  required?: boolean;
  slug?: string;
  oneOfLevel?: number;
  shouldCloseArray?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
}

export interface OneOfChangeParams {
  pointer: string;
  index: number;
}
