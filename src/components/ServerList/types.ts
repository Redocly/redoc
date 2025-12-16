import type { TFunction } from '@redocly/theme/core/openapi';
import type { OperationModel } from '../../models/index.js';

export type ServerListProps = Pick<OperationModel, 'servers' | 'path'> & {
  translate: TFunction;
};
