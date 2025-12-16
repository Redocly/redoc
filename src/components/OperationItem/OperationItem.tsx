import { memo, useState, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { ReactElement } from 'react';
import type { OperationItemProps } from './types';
import type { OperationModel } from '../../models';

import { SamplesMiddlePanel, SamplesPanel, ShareLink, Row, CustomBadges } from '../common/index.js';
import { CallbacksList } from '../Callbacks/index.js';
import { CallbackSamples } from '../CallbackSamples/index.js';
import { RequestSamples } from '../RequestSamples/index.js';
import { OperationResponseList } from '../Responses/index.js';
import { ResponseSamples } from '../ResponseSamples/index.js';
import { makeDeepLink } from '../../services/index.js';
import { layoutAtom } from '../../jotai/app.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { getOperation } from '../../models/operation.js';
import { Heading, Title } from '../common/OperationItemTitle.js';
import { LinkToField } from '../common/LinkToField.js';
import { RequestDetails } from '../Request/RequestDetails.js';
import { StyledBadge } from '../common/Badges.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

function OperationItemComponent({
  item: { operationDefinition, parent, href },
}: OperationItemProps): ReactElement {
  const translate = useTranslate();
  const { parser, options } = useAtomValue(globalStoreAtom);
  const layout = useAtomValue(layoutAtom);
  const [activeResponseTab, setActiveResponseTab] = useState<string>();

  const operation = useMemo(
    () => getOperation(parser, operationDefinition, parent, options, href),
    [href, operationDefinition, options, parent, parser],
  );

  const { name: summary, deprecated, isWebhook, badges } = operation || {};
  const isStacked = layout === LayoutVariant.STACKED;

  const [selectedCallback, setSelectedCallback] = useState<OperationModel | null>(null);

  const handleActiveResponseChange = useCallback(
    (tab: string) => {
      if (activeResponseTab !== tab) {
        setActiveResponseTab(tab);
      }
    },
    [activeResponseTab],
  );

  return (
    <OperationRow layout={layout}>
      <OperationSubRowStyled layout={layout}>
        <SamplesMiddlePanel isStacked={isStacked}>
          <Heading data-testid="operation-item-header">
            <ShareLink to={href} aria-label={`link to ${summary}`} />
            <CustomBadges badges={badges}>{summary}</CustomBadges>
            {deprecated && (
              <StyledBadge deprecated>
                {translate('openapi.badges.deprecated', 'Deprecated')}
              </StyledBadge>
            )}
            {isWebhook && (
              <StyledBadge>{translate('openapi.badges.webhook', 'Webhook')}</StyledBadge>
            )}
          </Heading>
        </SamplesMiddlePanel>
      </OperationSubRowStyled>
      <OperationSubRowStyled layout={layout}>
        <SamplesMiddlePanel isStacked={isStacked}>
          <RequestDetails operation={operation} translate={translate} />
        </SamplesMiddlePanel>
        <OperationSamplesPanel
          isStacked={isStacked}
          data-testid="samples-block"
          className="panel-container-request-samples"
        >
          <RequestSamples operation={operation} />
        </OperationSamplesPanel>
      </OperationSubRowStyled>

      <OperationSubRowStyled layout={layout}>
        <SamplesMiddlePanel isStacked={isStacked}>
          {operation.responses?.length ? (
            <OperationResponseList
              responses={operation.responses}
              operationId={operation.id}
              operationPointer={operation.pointer}
              callbackId={operation.callbackId}
              activeResponseTab={activeResponseTab}
              onTabChange={handleActiveResponseChange}
            />
          ) : null}
        </SamplesMiddlePanel>
        <OperationSamplesPanel
          isStacked={isStacked}
          data-testid="samples-block"
          className="panel-container-response-samples"
        >
          <ResponseSamples
            operation={operation}
            activeResponseTab={activeResponseTab}
            onTabChange={handleActiveResponseChange}
          />
        </OperationSamplesPanel>
      </OperationSubRowStyled>

      <OperationSubRowStyled layout={layout}>
        <SamplesMiddlePanel isStacked={isStacked}>
          {operation.callbacks?.length ? (
            <>
              <Title>
                <LinkToField to={makeDeepLink(operation.id, 'callbacks')} />
                {translate('openapi.callbacks', 'Callbacks')}
              </Title>
              <CallbacksList
                callbacks={operation.callbacks}
                onExpand={setSelectedCallback}
                selectedCallback={selectedCallback}
              />
            </>
          ) : null}
        </SamplesMiddlePanel>
        {selectedCallback ? (
          <OperationSamplesPanel isStacked={isStacked} data-testid="samples-block">
            <CallbackSamples callback={selectedCallback} translate={translate} />
          </OperationSamplesPanel>
        ) : null}
      </OperationSubRowStyled>
      <OperationSubRowStyled layout={layout}>
        <SamplesMiddlePanel isStacked={isStacked} fullWidth={true}></SamplesMiddlePanel>
      </OperationSubRowStyled>
    </OperationRow>
  );
}

export const OperationItem = memo<OperationItemProps>(OperationItemComponent);

export const OperationSamplesPanel = styled(SamplesPanel)`
  margin-left: auto;
  --code-block-padding: var(--spacing-xs) 0 var(--spacing-xs) 20px;
`;

const OperationRow = styled(Row)`
  flex-direction: column;
  align-items: flex-start;
  padding: var(--spacing-base) 0 calc(var(--spacing-xl) + var(--spacing-xs));
`;

const OperationSubRowStyled = styled(Row)`
  margin: calc(var(--spacing-unit) * 2) 0;
`;
