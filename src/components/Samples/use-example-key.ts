import { useAtomValue } from 'jotai';

import type { OperationModel } from '../../models/index.js';

import { operationStore } from '../../jotai/operation.js';

interface ExampleName {
  exampleKey: string;
}

export function useExampleKey(
  { pointer }: OperationModel = {} as OperationModel,
  examples: Record<string, unknown>,
): ExampleName {
  const operationState = useAtomValue(operationStore(pointer));
  const { activeExampleName } = operationState;

  return {
    exampleKey:
      activeExampleName && examples[activeExampleName]
        ? activeExampleName
        : Object.keys(examples)[0],
  };
}
