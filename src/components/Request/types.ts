import type { TFunction } from '@redocly/theme/core/openapi';
import type { ReactNode } from 'react';
import type { OperationModel } from '../../models';

export interface RequestProps {
  operation: Pick<
    OperationModel,
    | 'security'
    | 'pointer'
    | 'description'
    | 'externalDocs'
    | 'extensions'
    | 'parameters'
    | 'requestBody'
    | 'id'
    | 'callbackId'
  >;
  title?: string | ReactNode;
  translate?: TFunction;
}
