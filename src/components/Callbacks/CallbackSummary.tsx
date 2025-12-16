import type { ReactElement } from 'react';
import type { TFunction } from '@redocly/theme/core/openapi';
import type { OperationModel } from '../../models/index.js';

import { type PanelHeaderProps, PanelHeader } from '@redocly/theme/components/Panel/PanelHeader';
import { Badge } from '@redocly/theme/components/Badge/Badge';

import { Trigger } from '../Panel/index.js';
import { HttpVerb } from '../common/index.js';
import { makeDeepLink } from '../../services/index.js';
import { shortenHTTPVerb } from '../../utils/index.js';
import { CallbackTitle } from './styled.js';
import { CircleIcon } from '../PropertyDetails/PlusCircleIcon.js';
import { LinkToField } from '../common/LinkToField.js';
import { styled } from '../../styled-components.js';

export interface CallbackTitleProps extends PanelHeaderProps {
  callback: OperationModel;
  translate: TFunction;
}

export function CallbackSummary({
  expanded = false,
  toggle,
  callback: { name, httpVerb, deprecated, callbackId, id },
  translate,
}: CallbackTitleProps): ReactElement {
  return (
    <CallbackHeader expanded={expanded} onClick={toggle}>
      <LinkToField to={makeDeepLink(id, `callbacks/${callbackId}`)} />
      <Trigger>
        <CircleIconWrap>
          <CircleIcon sign={expanded ? '-' : '+'} />
        </CircleIconWrap>
        <CallbackTitle deprecated={deprecated}>{name}</CallbackTitle>
        <HttpVerb color={httpVerb}>{shortenHTTPVerb(httpVerb)}</HttpVerb>
        {deprecated ? (
          <Badge deprecated>{translate('openapi.badges.deprecated', 'Deprecated')}</Badge>
        ) : null}
      </Trigger>
    </CallbackHeader>
  );
}

const CallbackHeader = styled(PanelHeader)`
  padding: var(--spacing-sm) 0 var(--spacing-sm) calc(var(--spacing-unit) / 2);
  margin: 0;
  line-height: var(--line-height-base);
  position: relative;
`;

const CircleIconWrap = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  gap: var(--spacing-xxs);
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  line-height: var(--line-height-base);
`;
