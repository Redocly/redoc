import { memo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type { KeyboardEvent, ReactElement } from 'react';

import { itemStoreAtom, itemStoreFieldAtom } from '../../jotai/itemStore.js';
import { RESOURCES, statusClassOf, useTelemetry } from '../../telemetry/index.js';
import { ResponseCodeTab, ResponseCodesTabList } from '../common/ResponseCodeTabs.js';

type HeaderResponseCodeTabsProps = {
  codes: string[];
  itemId: string;
  firstCode: string;
};

export const HeaderResponseCodeTabs = memo(function HeaderResponseCodeTabs({
  codes,
  itemId,
  firstCode,
}: HeaderResponseCodeTabsProps): ReactElement {
  const storedCode = useAtomValue(itemStoreFieldAtom({ itemId, key: 'activeResponseCode' }));
  const setItemState = useSetAtom(itemStoreAtom(itemId));
  const telemetry = useTelemetry();
  const activeCode = storedCode || firstCode;
  const focusableCode = codes.includes(activeCode) ? activeCode : codes[0];
  const selectCode = (code: string): void => {
    telemetry.sendResponseCodeTabClickedMessage([
      { ...RESOURCES.responseCodeTab, statusClass: statusClassOf(code), total: codes.length },
    ]);
    setItemState({ activeResponseCode: code });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const lastIndex = codes.length - 1;
    const indexByKey: Record<string, number> = {
      ArrowRight: index === lastIndex ? 0 : index + 1,
      ArrowLeft: index === 0 ? lastIndex : index - 1,
      Home: 0,
      End: lastIndex,
    };
    const nextIndex = indexByKey[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectCode(codes[nextIndex]);
    (event.currentTarget.parentElement?.children[nextIndex] as HTMLElement | undefined)?.focus();
  };

  return (
    <ResponseCodesTabList role="tablist" aria-label="Response status" data-response-codes-tablist>
      {codes.map((code, index) => (
        <ResponseCodeTab
          key={code}
          type="button"
          role="tab"
          aria-selected={code === activeCode}
          tabIndex={code === focusableCode ? 0 : -1}
          $active={code === activeCode}
          $code={code}
          onClick={() => selectCode(code)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {code}
        </ResponseCodeTab>
      ))}
    </ResponseCodesTabList>
  );
});
