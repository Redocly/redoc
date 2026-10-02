import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ServerData } from '../../../types/common.js';

import { CopyButton } from '@redocly/theme/components/Buttons/CopyButton';

import {
  PanelItem,
  PanelItemDescription,
  Title,
  ServerTitleWrapper,
  TitleWrap,
} from '../../common/PanelItem.js';
import { Tag } from '../../common/Tag.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { Markdown } from '../../common/Markdown.js';
import { ViewNested } from '../../common/ViewNested.js';
import { ServerDescriptionTooltip } from './ServerDescriptionTooltip.js';
import { resolveServerUrl } from '../../../services/code-samples/normalize-servers.js';

export function ServerItem({ server }: { server: ServerData }): ReactElement {
  const translate = useSpecTranslate();

  const url = resolveServerUrl(server.url);
  const propertyLength = Object.keys(server.variables || {}).length;
  const keyword = propertyLength === 1 ? 'variable' : 'variables';
  const pluralOrSingular = `${propertyLength || ''} ${translate(keyword, keyword)}`;
  const showDescriptionTooltip = !!server.name && !!server.description;

  return (
    <PanelItem key={server.url}>
      <ServerTitleWrapper>
        <PanelItemDescription data-testid="server-panel-item-name">
          {server.name || server.description}
        </PanelItemDescription>
        {showDescriptionTooltip && <ServerDescriptionTooltip description={server.description} />}
      </ServerTitleWrapper>

      <TitleWrap>
        <Title suppressHydrationWarning>{url}</Title>
        <CopyButton data={url} key={url} />
      </TitleWrap>

      {server.variables && (
        <ViewNested
          expandText={`${translate('actions.show', 'Show')} ${pluralOrSingular}`}
          hideText={`${translate('actions.hide', 'Hide')} ${pluralOrSingular}`}
          expandByDefault={false}
          expandable
          hideDivider
        >
          <ServerVariablesContainer>
            {Object.entries(server.variables || {}).map(([varName, varValue]) => (
              <ServerVariableContainer key={varName}>
                <ServerVariableName>{varName}</ServerVariableName>
                <Variable>
                  {translate('default', 'Default')}{' '}
                  <Tag className="tag-grey">{varValue.default}</Tag>
                </Variable>

                {varValue.description &&
                  (typeof varValue.description === 'string' ? (
                    <div>{varValue.description}</div>
                  ) : (
                    <Description source={varValue.description} />
                  ))}
                {varValue.enum && (
                  <Variable>
                    {translate('enum', 'Enum')}{' '}
                    <TagWrapper>
                      {varValue.enum.map((el) => (
                        <Tag className="tag-grey" key={el}>
                          {el}
                        </Tag>
                      ))}
                    </TagWrapper>
                  </Variable>
                )}
              </ServerVariableContainer>
            ))}
          </ServerVariablesContainer>
        </ViewNested>
      )}
    </PanelItem>
  );
}

const ServerVariablesContainer = styled.div`
  padding-left: var(--spacing-xxs);
  & > div {
    border-bottom: 1px solid var(--border-color-secondary);
    margin-bottom: var(--spacing-xs);
    padding-bottom: var(--spacing-sm);
  }

  & > div:first-child {
    margin-top: var(--spacing-sm);
    padding-top: 0;
  }

  & > div:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const ServerVariableContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const Description = styled(Markdown)`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-primary);
`;

const Variable = styled.span`
  display: flex;
  gap: var(--spacing-xxs);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-primary);
`;

const ServerVariableName = styled(Variable)`
  padding-bottom: var(--spacing-xxs);
  font-weight: var(--font-weight-semibold);
`;

const TagWrapper = styled.span`
  display: flex;
  gap: var(--spacing-xxs);
  flex-wrap: wrap;
`;
