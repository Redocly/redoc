import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactNode } from 'react';
import type { ResponseModel } from '../../models/index.js';
import type { TabType } from '../../models/tab.js';

import { Tabs, useTabsState } from '../Tabs/index.js';
import { ResponseDetails } from './ResponseDetails.js';
import { makeDeepLink } from '../../services/index.js';
import { Row, StyledTitle } from './styled.js';
import { LinkToField } from '../common/LinkToField.js';
import { pathIncludesLink, hasNestedFields } from '../../utils/index.js';
import { ExpandAllButton } from '../ExpandAllButton/index.js';
import { useTranslate } from '../../hooks/index.js';
import { getActiveMediaType } from '../../models/index.js';
import { activeMimeNameAtom } from '../../jotai/app.js';
import { styled } from '../../styled-components.js';
import { useLocation } from '../../hooks/useLocation.js';

interface IOperationResponseList {
  responses: ResponseModel[];
  operationId: string;
  operationPointer: string;
  callbackId: string;
  renderTitle?: (tab: TabType) => ReactNode;
  activeResponseTab?: string;
  onTabChange?: (key: string) => void;
}

export const OperationResponseList = memo<IOperationResponseList>(
  ({
    responses,
    renderTitle,
    operationId,
    operationPointer,
    activeResponseTab,
    onTabChange,
    callbackId,
  }) => {
    const location = useLocation();
    const translate = useTranslate();
    const activeMimeName = useAtomValue(activeMimeNameAtom);
    const tabs = responses.map(({ code }) => ({ key: code, title: code }));
    const defaultTab = tabs.find(
      ({ key }) =>
        key === activeResponseTab ||
        (pathIncludesLink(location, operationId) && pathIncludesLink(location, `c=${key}`)),
    );

    const { activeTab, handleTabChange } = useTabsState({
      tabs,
      defaultTab: defaultTab?.key,
      onChange: onTabChange,
    });
    const tab = tabs.find((t) => t.key === (activeResponseTab || activeTab));

    const response = responses.find((r) => r.code === tab?.key);

    const showExpandAllButton = useMemo(() => {
      if (!response?.content) return false;

      const { schema } = getActiveMediaType(response?.content, activeMimeName) || {};

      return hasNestedFields(schema);
    }, [activeMimeName, response?.content]);

    if (!tab) return null;

    return (
      <>
        <TitleWrap>
          {renderTitle?.(tab) || (
            <StyledTitle>
              <LinkToField to={makeDeepLink(operationId, `response&c=${tab.key}`)} />
              {translate('openapi.responses', 'Responses')}
            </StyledTitle>
          )}
          <Tabs tabs={tabs} activeTab={tab} onChange={handleTabChange} />
          {showExpandAllButton && (
            <ExpandAllButton type="response" operationPointer={operationPointer} />
          )}
        </TitleWrap>
        {response ? (
          <div key={response.code}>
            <ResponseDetails
              response={response}
              operationId={operationId}
              callbackId={callbackId}
            />
          </div>
        ) : null}
      </>
    );
  },
);

const TitleWrap = styled(Row)`
  flex-wrap: wrap;
  gap: var(--spacing-unit);
`;
