import { SecurityRequirementModel } from '../../services/models/SecurityRequirement';
import {
  ScopeName,
  SecurityRequirementAndWrap,
  SecurityRequirementOrWrap,
} from './styled.elements';
import * as React from 'react';
import { AUTH_TYPES } from '../SecuritySchemes/SecuritySchemes';

export interface SecurityRequirementProps {
  security: SecurityRequirementModel;
  showSecuritySchemeType?: boolean;
  expanded: boolean;
}

export function SecurityHeader(props: SecurityRequirementProps) {
  const { security, showSecuritySchemeType, expanded } = props;

  const grouping = security.schemes.length > 1;
  if (security.schemes.length === 0)
    return <SecurityRequirementOrWrap $expanded={expanded}>None</SecurityRequirementOrWrap>;
  return (
    <SecurityRequirementOrWrap $expanded={expanded}>
      {grouping && '('}
      {security.schemes.map(scheme => {
        return (
          <SecurityRequirementAndWrap key={scheme.id}>
            {showSecuritySchemeType && `${AUTH_TYPES[scheme.type] || scheme.type}: `}
            <i>{scheme.displayName}</i>
            {expanded && scheme.scopes.length
              ? [
                  ' (',
                  scheme.scopes.map<React.ReactNode>(scope => (
                    <ScopeName key={scope}>{scope}</ScopeName>
                  )),
                  ') ',
                ]
              : null}
          </SecurityRequirementAndWrap>
        );
      })}
      {grouping && ') '}
    </SecurityRequirementOrWrap>
  );
}
