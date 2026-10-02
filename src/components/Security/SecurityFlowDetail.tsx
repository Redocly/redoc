import { useState } from 'react';

import type { ReactElement } from 'react';
import type { OAuthFlowEntry } from '../../types/store.js';
import type { SecurityScheme } from './types.js';
import type { TFunction } from '../../hooks/useTranslate.js';

import { ChevronRightIcon } from '@redocly/theme/icons/ChevronRightIcon/ChevronRightIcon';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { OAUTH2_FLOW_NAMES, RESOURCES, useTelemetry } from '../../telemetry/index.js';
import type { Oauth2Flow } from '../../telemetry/index.js';
import { normalizeScopes } from '../../utils/security-scope.js';
import { Markdown } from '../common/Markdown.js';
import {
  OptionalScopesChevron,
  OptionalScopesList,
  OptionalScopesToggle,
  DeprecatedBadge,
  FlowDescription,
  FlowProperties,
  FlowTitle,
  FlowTitleWrapper,
  FlowTypeBody,
  FlowTypeName,
  FlowTypeSection,
  FlowTypeTag,
  FlowWrapper,
  PropertyLabel,
  PropertyRow,
  PropertyValue,
  SchemeLink,
  ScopesLabel,
  ScopesList,
  ScopesSection,
} from './styled.js';
import { ScopeTagWithTooltip } from './ScopeTagWithTooltip.js';

const MAX_VISIBLE_SCOPE_CHARS = 24;

export function SecurityFlowDetail({ scheme }: { scheme: SecurityScheme }): ReactElement | null {
  const translate = useSpecTranslate();
  const { type, name } = scheme;
  if (!type || !name) return null;

  return (
    <FlowWrapper>
      <FlowTitleWrapper>
        <FlowTitle>{name}</FlowTitle>
        {scheme.deprecated && (
          <DeprecatedBadge>{translate('badges.deprecated', 'deprecated')}</DeprecatedBadge>
        )}
      </FlowTitleWrapper>
      {scheme.description && (
        <FlowDescription>
          {typeof scheme.description === 'string' ? (
            scheme.description
          ) : (
            <Markdown source={scheme.description} />
          )}
        </FlowDescription>
      )}
      <FlowProperties>
        {type === 'http' && <HttpSchemeDetails scheme={scheme} translate={translate} />}
        {type === 'apiKey' && <ApiKeySchemeDetails scheme={scheme} translate={translate} />}
        {type === 'oauth2' && <OAuth2SchemeDetails scheme={scheme} translate={translate} />}
        {type === 'openIdConnect' && <OpenIdSchemeDetails scheme={scheme} translate={translate} />}
      </FlowProperties>
    </FlowWrapper>
  );
}

function HttpSchemeDetails({
  scheme,
  translate,
}: {
  scheme: SecurityScheme;
  translate: TFunction;
}): ReactElement {
  return (
    <>
      <SchemeRow
        label={translate('httpAuthorizationScheme', 'HTTP Authorization Scheme')}
        value={scheme.type}
      />
      <SchemeRow label={translate('bearerFormat', 'Bearer Format')} value={scheme.bearerFormat} />
      <RequiredScopesRow scopes={scheme.scopes} translate={translate} />
    </>
  );
}

function ApiKeySchemeDetails({
  scheme,
  translate,
}: {
  scheme: SecurityScheme;
  translate: TFunction;
}): ReactElement {
  const location = scheme.in ? `${scheme.in.charAt(0).toUpperCase() + scheme.in.slice(1)} ` : '';
  return (
    <>
      <SchemeRow
        label={`${location}${translate('parameterName', 'parameter name')}:`}
        value={scheme.paramName}
      />
      <RequiredScopesRow scopes={scheme.scopes} translate={translate} />
    </>
  );
}

function OAuth2SchemeDetails({
  scheme,
  translate,
}: {
  scheme: SecurityScheme;
  translate: TFunction;
}): ReactElement {
  const flows = scheme.flows;
  if (!flows) return <></>;
  const scopeDescriptions = buildScopeDescriptionIndex(flows);

  const flowEntries = Object.entries(flows).filter(([, val]) => val != null) as [
    string,
    OAuthFlowEntry,
  ][];

  return (
    <>
      {scheme.oauth2MetadataUrl && (
        <SchemeRow
          label={`${translate('oauth2MetadataUrl', 'OAuth2 Metadata URL')}:`}
          value={
            <SchemeLink href={scheme.oauth2MetadataUrl} target="_blank" rel="noopener noreferrer">
              {scheme.oauth2MetadataUrl}
            </SchemeLink>
          }
        />
      )}
      {flowEntries.map(([flowType, flow]) => (
        <OAuthFlowSection
          key={flowType}
          flowType={flowType}
          flow={flow}
          requiredScopes={scheme.scopes}
          translate={translate}
        />
      ))}
      <RequiredScopesRow
        scopes={scheme.scopes}
        scopeDescriptions={scopeDescriptions}
        translate={translate}
      />
    </>
  );
}

function OAuthFlowSection({
  flowType,
  flow,
  requiredScopes,
  translate,
}: {
  flowType: string;
  flow: OAuthFlowEntry;
  requiredScopes?: string[];
  translate: TFunction;
}): ReactElement {
  const [showOptionalScopes, setShowOptionalScopes] = useState(false);
  const telemetry = useTelemetry();
  const { authorizationUrl, tokenUrl, refreshUrl, deviceAuthorizationUrl, scopes } = flow;
  const optionalScopes = getOptionalScopes(requiredScopes, scopes);

  const handleOptionalScopesToggle = (): void => {
    const expanded = !showOptionalScopes;
    if (OAUTH2_FLOW_NAMES.has(flowType)) {
      telemetry.sendSecurityOptionalScopesExpandedMessage([
        {
          ...RESOURCES.securityOptionalScopesToggle,
          expanded,
          flow: flowType as Oauth2Flow,
          optionalScopesCount: optionalScopes.length,
          requiredScopesCount: normalizeScopes(requiredScopes).length,
        },
      ]);
    }
    setShowOptionalScopes(expanded);
  };

  return (
    <FlowTypeSection>
      <FlowTypeTag>
        <span>{translate('flowType', 'Flow type')}</span>
        <FlowTypeName>{flowType}</FlowTypeName>
      </FlowTypeTag>
      <FlowTypeBody>
        {authorizationUrl && (
          <SchemeRow
            label={`${translate('authorizationUrl', 'Authorization URL')}:`}
            value={<SchemeLink href={authorizationUrl}>{authorizationUrl}</SchemeLink>}
          />
        )}
        {deviceAuthorizationUrl && (
          <SchemeRow
            label={`${translate('deviceAuthorizationUrl', 'Device Authorization URL')}:`}
            value={<SchemeLink href={deviceAuthorizationUrl}>{deviceAuthorizationUrl}</SchemeLink>}
          />
        )}
        {tokenUrl && (
          <SchemeRow
            label={`${translate('tokenUrl', 'Token URL')}:`}
            value={<SchemeLink href={tokenUrl}>{tokenUrl}</SchemeLink>}
          />
        )}
        {refreshUrl && (
          <SchemeRow
            label={`${translate('refreshUrl', 'Refresh URL')}:`}
            value={<SchemeLink href={refreshUrl}>{refreshUrl}</SchemeLink>}
          />
        )}
        {optionalScopes.length > 0 && (
          <ScopesSection>
            <OptionalScopesToggle type="button" onClick={handleOptionalScopesToggle}>
              {showOptionalScopes
                ? translate('hideOptionalScopes', 'Hide optional scopes')
                : translate('showOptionalScopes', 'Show optional scopes')}
              <OptionalScopesChevron $isOpen={showOptionalScopes}>
                <ChevronRightIcon
                  size="var(--font-size-base)"
                  color="var(--tree-content-color-default)"
                />
              </OptionalScopesChevron>
            </OptionalScopesToggle>
            <OptionalScopesList $isOpen={showOptionalScopes}>
              {optionalScopes.map(([scope, description]) => (
                <SchemeRow
                  key={scope}
                  label={
                    <ScopeTagWithTooltip text={scope} maxChars={MAX_VISIBLE_SCOPE_CHARS} large />
                  }
                  value={description || ' '}
                />
              ))}
            </OptionalScopesList>
          </ScopesSection>
        )}
      </FlowTypeBody>
    </FlowTypeSection>
  );
}

function OpenIdSchemeDetails({
  scheme,
  translate,
}: {
  scheme: SecurityScheme;
  translate: TFunction;
}): ReactElement {
  return (
    <>
      {scheme.openIdConnectUrl && (
        <SchemeRow
          label={translate('connectUrl', 'Connect URL')}
          value={
            <SchemeLink href={scheme.openIdConnectUrl} target="_blank" rel="noopener noreferrer">
              {scheme.openIdConnectUrl}
            </SchemeLink>
          }
        />
      )}
      <RequiredScopesRow scopes={scheme.scopes} translate={translate} />
    </>
  );
}

function SchemeRow({
  label,
  value,
}: {
  label: string | ReactElement;
  value?: string | ReactElement;
}): ReactElement | null {
  if (!value) return null;
  return (
    <PropertyRow>
      <PropertyLabel>{label}</PropertyLabel>
      <PropertyValue>{value}</PropertyValue>
    </PropertyRow>
  );
}

function getOptionalScopes(
  requiredScopes: string[] | undefined,
  flowScopes: Record<string, string> | undefined,
): [string, string][] {
  if (!flowScopes) {
    return [];
  }

  const requiredScopeSet = new Set(normalizeScopes(requiredScopes));

  return Object.entries(flowScopes).filter(([scope]) => !requiredScopeSet.has(scope.trim()));
}

function RequiredScopesRow({
  scopes,
  scopeDescriptions,
  translate,
}: {
  scopes?: string[];
  scopeDescriptions?: Map<string, string> | null;
  translate: TFunction;
}): ReactElement | null {
  const normalizedScopes = normalizeScopes(scopes);
  if (normalizedScopes.length === 0) return null;

  if (scopeDescriptions && scopeDescriptions.size > 0) {
    return (
      <>
        <SchemeRow label={translate('requiredScopes', 'Required scopes')} value=" " />
        {normalizedScopes.map((scope) => (
          <SchemeRow
            key={scope}
            label={<ScopeTagWithTooltip text={scope} maxChars={MAX_VISIBLE_SCOPE_CHARS} large />}
            value={scopeDescriptions.get(scope) || ' '}
          />
        ))}
      </>
    );
  }

  return (
    <ScopesSection>
      <ScopesLabel>{translate('requiredScopes', 'Required scopes')}</ScopesLabel>
      <ScopesList>
        {normalizedScopes.map((scope) => (
          <ScopeTagWithTooltip key={scope} text={scope} maxChars={MAX_VISIBLE_SCOPE_CHARS} large />
        ))}
      </ScopesList>
    </ScopesSection>
  );
}

function buildScopeDescriptionIndex(
  flows: SecurityScheme['flows'] | undefined,
): Map<string, string> | null {
  if (!flows) {
    return null;
  }

  const scopeDescriptions = new Map<string, string>();

  Object.values(flows).forEach((flow) => {
    if (!flow?.scopes) {
      return;
    }

    Object.entries(flow.scopes).forEach(([scope, description]) => {
      const normalizedScope = scope.trim();

      if (!normalizedScope || scopeDescriptions.has(normalizedScope)) {
        return;
      }

      scopeDescriptions.set(normalizedScope, description);
    });
  });

  return scopeDescriptions.size > 0 ? scopeDescriptions : null;
}
