import { memo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type { ReactElement } from 'react';

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
  const selectCode = (code: string): void => {
    telemetry.sendResponseCodeTabClickedMessage([
      { ...RESOURCES.responseCodeTab, statusClass: statusClassOf(code), total: codes.length },
    ]);
    setItemState({ activeResponseCode: code });
  };

  return (
    <ResponseCodesTabList role="tablist" aria-label="Response status" data-response-codes-tablist>
      {codes.map((code) => (
        <ResponseCodeTab
          key={code}
          type="button"
          role="tab"
          $active={code === activeCode}
          $code={code}
          onClick={() => selectCode(code)}
        >
          {code}
        </ResponseCodeTab>
      ))}
    </ResponseCodesTabList>
  );
});
