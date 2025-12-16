import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import merge from 'deepmerge';

export type OperationStore = {
  activeExampleName?: string;
  activeOneOf: { [pointer: string]: number };
  activeSecuritySchemeIds?: string[];
  requestValues: { [field: string]: any };
  request: {
    expandedAll?: boolean;
  };
  response: {
    expandedAll?: boolean;
  };
};

export function getDefaultOperationStore(
  pointer: string,
  requestValues: { [field: string]: any } = {},
  activeExampleName?: string,
) {
  return {
    activeExampleName,
    activeOneOf: {
      [pointer]: 0,
    },
    requestValues: requestValues,
    request: {
      expandedAll: undefined,
    },
    response: {
      expandedAll: undefined,
    },
  };
}

export const allOperations = atom<Record<string, OperationStore>>({});

export const operationStore = atomFamily((pointer: string) =>
  atom(
    (get) => get(allOperations)?.[pointer] || getDefaultOperationStore(pointer),
    (get, set, update: Partial<OperationStore>) => {
      const prevStore = get(allOperations);
      const prevValue = prevStore[pointer] || getDefaultOperationStore(pointer);

      set(allOperations, {
        ...prevStore,
        [pointer]: merge(prevValue, update),
      });
    },
  ),
);
