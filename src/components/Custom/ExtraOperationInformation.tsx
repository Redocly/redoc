import * as React from 'react';

import { MenuItemTitle, OperationBadge } from '../SideMenu';
import { observer } from 'mobx-react';
import { shortenHTTPVerb } from '../../utils';

export interface ExtraOperationInformationProps {
  httpVerb: string;
  label: string;
}

export const ExtraOperationInformation = observer((props: ExtraOperationInformationProps) => {
  const item = props;

  return (
    <div>
      <OperationBadge type={item.httpVerb}>{shortenHTTPVerb(item.httpVerb)}</OperationBadge>
      <MenuItemTitle width="calc(100% - 38px)">{item.label}</MenuItemTitle>
    </div>
  );
});
