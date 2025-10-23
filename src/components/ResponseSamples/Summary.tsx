import type { ReactNode, ReactElement } from 'react';

import { PanelHeader } from '@redocly/theme/components/Panel/PanelHeader';
import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { useTranslate } from '../../hooks/index.js';

export interface SummaryProps {
  tabs?: ReactNode;
}

export const Summary = ({ tabs }: SummaryProps): ReactElement => {
  const translate = useTranslate();
  return (
    <PanelHeader isExpandable={false}>
      <PanelHeaderTitle data-testid="title">
        {translate('openapi.response', 'Response')}
      </PanelHeaderTitle>
      {tabs}
    </PanelHeader>
  );
};
