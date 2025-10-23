import { useAtomCallback } from 'jotai/utils';
import { useCallback } from 'react';

export const useWriteAtom = () => {
  const writeAtomCallback = useAtomCallback(
    useCallback((_get, set) => {
      return set;
    }, []),
  );
  return writeAtomCallback();
};
