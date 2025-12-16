import { memo, useState } from 'react';

import type { PropsWithChildren, ReactElement } from 'react';
import type { OpenAPISecurityScheme } from '../../types/index.js';
import type { SecurityRequirement } from '../../models/index.js';

import { ChevronRightIcon } from '@redocly/theme/icons/ChevronRightIcon/ChevronRightIcon';

import { Markdown } from '../Markdown/index.js';
import { SecuritySchemeItem } from './SecuritySchemeItem.js';
import { Tag } from './styled.js';
import { useTranslate } from '../../hooks/index.js';
import { getOptionalScopes, getRequiredScopes } from './helper.js';
import { styled } from '../../styled-components.js';

type Flow = OpenAPISecurityScheme['flows'];
type FlowType = keyof Flow;

interface OAuthScopesMainProps {
  id: string;
  securities: SecurityRequirement[];
  flows?: Flow;
}

interface OAuthScopesGroupProps {
  requiredScopes: string[];
  flows?: Flow;
}

interface OAuthFlowScopeProps {
  flow: Flow[FlowType];
  requiredScopes: string[];
}

function OAuthScopesComponent({ id, securities, flows }: PropsWithChildren<OAuthScopesMainProps>) {
  const requiredScopes = getRequiredScopes(id, securities);

  return (
    <>
      <OAuthRequiredScopes flows={flows} requiredScopes={requiredScopes} />
      <OAuthOptionalScopes flows={flows} requiredScopes={requiredScopes} />
    </>
  );
}

function OAuthOptionalScopes({ flows, requiredScopes }: PropsWithChildren<OAuthScopesGroupProps>) {
  return (
    flows &&
    Object.keys(flows).map((type) => (
      <OAuthOptionalScope flow={flows[type]} requiredScopes={requiredScopes} key={type} />
    ))
  );
}

function OAuthOptionalScope({
  flow,
  requiredScopes,
}: PropsWithChildren<OAuthFlowScopeProps>): ReactElement | null {
  const translate = useTranslate();
  const [showScopes, setShowScopes] = useState(false);

  const flowScopes = Object.keys(flow?.scopes || {});
  const optionalScopes = getOptionalScopes(requiredScopes, flowScopes);

  if (optionalScopes.length === 0) {
    return null;
  }

  const toggleScopes = (): void => {
    setShowScopes((prevShowScopes) => !prevShowScopes);
  };

  return (
    <>
      <SecuritySchemeItem
        label={
          <ScopeHeader onClick={toggleScopes}>
            {translate(
              showScopes ? 'openapi.hideOptionalScopes' : 'openapi.showOptionalScopes',
              showScopes ? 'Hide optional scopes' : 'Show optional scopes',
            )}
            <AnimatedChevronWrapper isOpen={showScopes}>
              <ChevronRightIcon
                size="var(--font-size-base)"
                color="var(--tree-content-color-default)"
              />
            </AnimatedChevronWrapper>
          </ScopeHeader>
        }
        value=" "
      />
      <ScopesListWrapper isOpen={showScopes}>
        {optionalScopes.map((scope) => (
          <SecuritySchemeItem
            key={scope}
            label={<StyledTag className="tag-grey">{scope}</StyledTag>}
            value={<Markdown source={flow?.scopes[scope] || ''} />}
          />
        ))}
      </ScopesListWrapper>
    </>
  );
}

function OAuthRequiredScopes({ requiredScopes, flows }: PropsWithChildren<OAuthScopesGroupProps>) {
  const translate = useTranslate();

  if (requiredScopes.length === 0) {
    return null;
  }

  if (flows && Object.keys(flows).length > 0) {
    return Object.keys(flows).map((type) => (
      <OAuthRequiredScope flow={flows[type]} requiredScopes={requiredScopes} key={type} />
    ));
  }

  return (
    <SecuritySchemeItem
      label={translate('openapi.requiredScopes', 'Required scopes')}
      value={
        <Row>
          {requiredScopes.map((scope) => (
            <Tag key={scope} className="tag-grey">
              {scope}
            </Tag>
          ))}
        </Row>
      }
    />
  );
}

function OAuthRequiredScope({
  flow,
  requiredScopes,
}: PropsWithChildren<OAuthFlowScopeProps>): ReactElement | null {
  const translate = useTranslate();

  return (
    <>
      <SecuritySchemeItem
        label={translate('openapi.requiredScopes', 'Required scopes')}
        value=" "
      />
      {requiredScopes.map((scope) => (
        <SecuritySchemeItem
          key={scope}
          label={<StyledTag className="tag-grey">{scope}</StyledTag>}
          value={<Markdown source={flow?.scopes[scope] || ''} />}
        />
      ))}
    </>
  );
}

const StyledTag = styled(Tag)`
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  align-self: flex-start;
  padding: 0 var(--spacing-xs);
  border: var(--tag-border-width) var(--tag-border-style) var(--tag-bg-color);
  border-radius: var(--tag-border-radius);
`;

const ScopeHeader = styled.div`
  cursor: pointer;
  display: flex;
  gap: var(--spacing-xxs);
  align-items: center;
  user-select: none;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
  word-break: normal;
`;

const ScopesListWrapper = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? '1000px' : '0')};
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  overflow: hidden;
  transition:
    max-height 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
`;

const AnimatedChevronWrapper = styled.span<{ isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: ${(props) => (props.isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  transition: transform 0.5s ease-in-out;
`;

export const OAuthScopes = memo<PropsWithChildren<OAuthScopesMainProps>>(OAuthScopesComponent);
