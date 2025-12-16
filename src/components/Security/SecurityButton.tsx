import { Fragment } from 'react';

import type { ReactElement, ReactNode } from 'react';
import type { SecurityRequirement } from '../../models/index.js';

import { SecurityIcon } from '@redocly/theme/icons/SecurityIcon/SecurityIcon';
import { Panel } from '@redocly/theme/components/Panel/Panel';
import { Button } from '@redocly/theme/components/Button/Button';
import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';
import { WarningFilledIcon } from '@redocly/theme/icons/WarningFilledIcon/WarningFilledIcon';

import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';
import { deprecatedCss } from '../common/index.js';

interface SecurityRequirementsProps {
  securities: SecurityRequirement[];
}

export interface SecurityButtonProps extends SecurityRequirementsProps {
  onClick: () => void;
}

export function SecurityButton({ securities, onClick }: SecurityButtonProps): ReactElement {
  const translate = useTranslate();

  const securityHeader = () => {
    return (
      <SecurityHeader>
        <SecurityIcon />
        <Title>{translate('openapi.security', 'Security')}</Title>
        <ViewDetailsButton onClick={onClick} variant="link">
          {translate('openapi.viewSecurityDetails', 'View details')}
        </ViewDetailsButton>
      </SecurityHeader>
    );
  };

  return (
    <SecurityPanel header={securityHeader} isExpandable={false}>
      <SecurityList>
        {securities.map((security, secIndex) => {
          const isMultiple = securities.length > 1 && security.schemes.length > 1;
          const schemeNodes: ReactNode[] = security.schemes.map(
            ({ id, deprecated = false }, index) => (
              <Fragment key={id}>
                <TitleSchema deprecated={deprecated}>
                  {id}
                  {deprecated && (
                    <Tooltip tip={translate('openapi.badges.deprecated', 'Deprecated')}>
                      <WarningFilledIcon color="var(--badge-deprecated-bg-color)" />
                    </Tooltip>
                  )}
                </TitleSchema>
                {index < security.schemes.length - 1 && <Conjunction> and </Conjunction>}
              </Fragment>
            ),
          );

          return (
            <Fragment key={secIndex}>
              {isMultiple ? '(' : ''}
              {schemeNodes}
              {isMultiple ? ')' : ''}
              {secIndex < securities.length - 1 && <Conjunction> or </Conjunction>}
            </Fragment>
          );
        })}
      </SecurityList>
    </SecurityPanel>
  );
}

const TitleSchema = styled.span<{ deprecated: boolean }>`
  ${({ deprecated }) => deprecated && deprecatedCss}
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
  display: inline-flex;
};
`;

const SecurityPanel = styled(Panel)`
  margin-top: var(--spacing-base);
  border: var(--panel-border);
  border-radius: var(--panel-border-radius);
`;

const SecurityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xs);
  color: var(--link-color-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--layer-color);
  border-bottom: var(--panel-border);
  border-radius: var(--panel-border-radius) var(--panel-border-radius) 0 0;
`;

const ViewDetailsButton = styled(Button)`
  margin-left: auto;
  font-size: var(--font-size-sm);
`;

const Title = styled.span`
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-color-primary);
`;

const SecurityList = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--text-color-primary);
`;

const Conjunction = styled.span`
  color: var(--text-color-description);
`;
