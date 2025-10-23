import type { GroupModel, OperationMenuItem } from '../../models/index.js';

export type OperationsNavigationProps = {
  items: (OperationMenuItem | GroupModel)[];
  routingBasePath: string;
};
