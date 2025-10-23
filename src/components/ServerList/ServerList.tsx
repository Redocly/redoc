import type { ReactElement } from 'react';
import type { ServerListProps } from './types.js';

import { CopyButton } from '@redocly/theme/components/Buttons/CopyButton';

import { getServerDisplayName } from '../../utils/helpers.js';
import { PanelItemDescription, Title } from '../PanelItem/index.js';
import { ViewNested } from '../ViewNested/index.js';
import { Tag } from '../common/index.js';
import { Markdown } from '../Markdown/index.js';
import { styled } from '../../styled-components.js';
import { ServerDescriptionTooltip } from './ServerDescriptionTooltip.js';

export const ServerList = ({ servers, path, translate }: ServerListProps): ReactElement => (
  <ItemsList>
    {servers.map((server) => {
      const url = server.url + path;
      const propertyLength = Object.keys(server.variables || {}).length;
      const keyword = propertyLength === 1 ? 'variable' : 'variables';
      const pluralOrSingular = `${propertyLength || ''} ${translate(
        `openapi.${keyword}`,
        keyword,
      )}`;
      const showDescriptionTooltip = !!server.name && !!server.description;

      {
        /* TODO: highlight server variables, e.g. https://{user}.test.com */
      }

      return (
        <div key={server.url}>
          <ServerTitleWrapper>
            <PanelItemDescription data-testid="server-panel-item-name">
              {getServerDisplayName(server)}
            </PanelItemDescription>
            {showDescriptionTooltip && (
              <ServerDescriptionTooltip description={server.description} />
            )}
          </ServerTitleWrapper>

          <TitleWrap>
            <Title suppressHydrationWarning>{url}</Title>
            <CopyButton data={url} key={url} />
          </TitleWrap>
          {server.variables && (
            <ViewNested
              expandText={`${translate('openapi.actions.show', 'Show')} ${pluralOrSingular}`}
              hideText={`${translate('openapi.actions.hide', 'Hide')} ${pluralOrSingular}`}
              expandByDefault={false}
              expandable
              hideDivider
            >
              <ServerVariablesContainer>
                {Object.entries(server.variables || {}).map(([varName, varValue]) => (
                  <ServerVariableContainer key={varName}>
                    <ServerVariableName>{varName}</ServerVariableName>
                    <Variable>
                      {translate('openapi.default', 'Default')}{' '}
                      <StyledTag>{varValue.default}</StyledTag>
                    </Variable>
                    <Description source={varValue.description} />
                    {varValue.enum && (
                      <Variable>
                        {translate('openapi.enum', 'Enum')}{' '}
                        <TagWrapper>
                          {varValue.enum.map((el) => (
                            <StyledTag key={el}>{el}</StyledTag>
                          ))}
                        </TagWrapper>
                      </Variable>
                    )}
                  </ServerVariableContainer>
                ))}
              </ServerVariablesContainer>
            </ViewNested>
          )}
        </div>
      );
    })}
  </ItemsList>
);

const ItemsList = styled.div`
  & > div {
    border-bottom: 1px solid var(--border-color-secondary);
    margin-bottom: var(--spacing-xs);
    padding-bottom: var(--spacing-sm);
  }

  & > div:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

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

const StyledTag = styled(Tag)`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
`;

const ServerTitleWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: var(--spacing-xxs);
`;

const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
