import * as React from 'react';

import { MenuItemTitle, OperationBadge } from '../SideMenu';
import { observer } from 'mobx-react';
import { shortenHTTPVerb } from '../../utils';

export interface ExtraOperationInformationProps {
  description: string;
  httpVerb: string;
  label: string;
}

export const ExtraOperationInformation = observer((props: ExtraOperationInformationProps) => {
  return (
    <div style={{ padding: '12.5px 0', margin: '0.5rem 0' }}>
      <div>{props.description}</div>
      <div style={{ display: 'flex' }}>
        <OperationBadge type={props.httpVerb}>{shortenHTTPVerb(props.httpVerb)}</OperationBadge>
        <MenuItemTitle width="calc(100% - 38px)">{props.label}</MenuItemTitle>
      </div>
    </div>
  );
});
