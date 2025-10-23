import { useEffect, useState } from 'react';

export function useActiveWithFallback<TOption extends { key: string }>(
  options: TOption[],
  activeKey: string,
): string | undefined {
  const activeOption = options.find(({ key }) => key === activeKey);
  const [currentKey, setCurrentKey] = useState(activeOption?.key || options[0]?.key);

  useEffect(() => {
    if (activeOption) {
      setCurrentKey(activeOption.key);
    }
  }, [activeOption]);

  return currentKey;
}
