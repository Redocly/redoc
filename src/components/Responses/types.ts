import type { ResponseModel, FieldModel } from '../../models/index.js';

export interface ResponseProps {
  response: ResponseModel;
  shouldBeExpandedByDefault?: boolean;
  onToggle?: (code: string) => void;
  operationId: string;
  callbackId?: string;
  disableDeepLinks?: boolean;
}

export interface ResponseHeadersProps {
  headers?: FieldModel[];
  deepLink?: string;
}
