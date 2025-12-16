import { useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';

import type { MediaContentModel } from '../models/index.js';

import { getActiveMediaType } from '../models/index.js';
import { operationStore } from '../jotai/operation.js';
import { activeMimeNameAtom } from '../jotai/app.js';

export function useActivateExample(mediaContent?: MediaContentModel) {
  const setOperationStore = useSetAtom(
    operationStore(mediaContent?.operation.pointer || 'no_operation_pointer'),
  );
  const activeMimeName = useAtomValue(activeMimeNameAtom);
  const active = mediaContent ? getActiveMediaType(mediaContent, activeMimeName) : undefined;

  return useCallback(
    (key: string) => {
      if (!active) {
        return;
      }
      if (active.examples && active.schema?.oneOf && Object.keys(active.examples).includes(key)) {
        const activeOneOfIndex = active.schema?.oneOf?.findIndex((schema) => schema.title === key);
        if (activeOneOfIndex === -1) {
          setOperationStore({
            activeExampleName: key,
            requestValues: {},
          });
        } else {
          setOperationStore({
            activeOneOf: { [active.schema?.pointer || '']: activeOneOfIndex },
            activeExampleName: active.schema?.oneOf?.[activeOneOfIndex]?.title,
            requestValues: {},
          });
        }
      } else {
        setOperationStore({ activeExampleName: key, requestValues: {} });
      }
    },
    [active, setOperationStore],
  );
}
