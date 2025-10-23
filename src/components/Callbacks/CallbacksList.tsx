import { memo } from 'react';

import type { ReactElement } from 'react';
import type { CallbackModel, OperationModel } from '../../models/index.js';

import { CallbackOperation } from './CallbackOperation.js';

export interface CallbacksListProps {
  callbacks: CallbackModel[];
  onExpand: (a: OperationModel | null) => void;
  selectedCallback: OperationModel | null;
}

function CallbacksListComponent({
  callbacks,
  selectedCallback,
  onExpand,
}: CallbacksListProps): ReactElement | null {
  if (!callbacks || callbacks.length === 0) {
    return null;
  }

  const handleSelectCallback = (callbackId) => {
    onExpand(callbackId);
  };

  return (
    <div>
      {callbacks.map((callback) =>
        callback.operations.map((operation) => {
          return (
            <CallbackOperation
              key={operation.name}
              operation={operation}
              selectedCallback={selectedCallback}
              onExpand={handleSelectCallback}
            />
          );
        }),
      )}
    </div>
  );
}

export const CallbacksList = memo<CallbacksListProps>(CallbacksListComponent);
