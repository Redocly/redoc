import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { normalizeScopes } from '../../utils/security-scope.js';
import { ScopeTagWithTooltip } from './ScopeTagWithTooltip.js';

const MAX_INLINE_SCOPES = 4;
const MAX_VISIBLE_SCOPE_CHARS = 32;

export function RequiredScopes({ scopes }: { scopes?: string[] }): ReactElement | null {
  const translate = useSpecTranslate();
  const normalizedScopes = normalizeScopes(scopes);

  if (normalizedScopes.length === 0) return null;

  const visibleScopes = normalizedScopes.slice(0, MAX_INLINE_SCOPES);
  const hiddenScopes = normalizedScopes.slice(MAX_INLINE_SCOPES);
  const hiddenCount = hiddenScopes.length;

  return (
    <>
      {visibleScopes.map((scope) => (
        <ScopeTagWithTooltip key={scope} text={scope} maxChars={MAX_VISIBLE_SCOPE_CHARS} />
      ))}
      {hiddenCount > 0 && (
        <ScopeTagWithTooltip
          arrowPosition="left"
          text={`+${hiddenCount}`}
          tip={
            <TooltipScopesList>
              {hiddenScopes.map((scope) => (
                <div key={scope}>{scope}</div>
              ))}
            </TooltipScopesList>
          }
          ariaLabel={translate('showMoreScopes', `Show ${hiddenCount} more scopes`)}
        />
      )}
    </>
  );
}

const TooltipScopesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
`;
