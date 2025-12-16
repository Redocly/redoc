import type { TFunction } from '@redocly/theme/core/openapi';
import type { ReactElement } from 'react';
import type { OpenAPIInfo } from '../../types/index.js';

import { CopyButton } from '@redocly/theme/components/Buttons/CopyButton';
import { NewTabButton } from '@redocly/theme/components/Buttons/NewTabButton';
import { EmailButton } from '@redocly/theme/components/Buttons/EmailButton';

import { PanelItem, PanelItemDescription, PanelItemsList } from '../PanelItem/index.js';

type OverviewProps = {
  info: OpenAPIInfo;
  translate: TFunction;
};

export function Overview({ info, translate }: OverviewProps): ReactElement {
  const website =
    (info.contact && info.contact.url && (
      <PanelItem
        header={
          <PanelItemDescription>
            {translate('openapi.info.contact.url', 'URL')}
          </PanelItemDescription>
        }
        title={
          <a href={info.contact.url} target="_blank" rel="noreferrer">
            {info.contact.url}
          </a>
        }
        actions={[<NewTabButton data={info.contact.url} key="NewTabButton" />]}
      />
    )) ||
    null;

  const email =
    (info.contact && info.contact.email && (
      <PanelItem
        header={
          <PanelItemDescription>
            {info.contact.name || translate('openapi.info.contact.name', 'E-mail')}
          </PanelItemDescription>
        }
        title={<a href={'mailto:' + info.contact.email}>{info.contact.email}</a>}
        actions={[
          <CopyButton data={info.contact.email} key="CopyButton" />,
          <EmailButton data={info.contact.email} key="EmailButton" />,
        ]}
      />
    )) ||
    null;

  const license =
    (info.license && (
      <PanelItem
        header={
          <PanelItemDescription>
            {translate('openapi.info.license', 'License')}
          </PanelItemDescription>
        }
        title={
          info.license.identifier ? (
            info.license.identifier
          ) : (
            <a href={info.license.url} target="_blank" rel="noreferrer">
              {info.license.name}
            </a>
          )
        }
        actions={[<NewTabButton data={info.license.url || ''} key="NewTabButton" />]}
      />
    )) ||
    null;

  const terms =
    (info.termsOfService && (
      <PanelItem
        title={
          <a href={info.termsOfService} target="_blank" rel="noreferrer">
            {translate('openapi.info.termsOfService', 'Terms of Service')}
          </a>
        }
        actions={[<NewTabButton data={info.termsOfService} key={info.termsOfService} />]}
      />
    )) ||
    null;

  return (
    <>
      <PanelItemsList>
        {website}
        {email}
        {license}
        {terms}
      </PanelItemsList>
    </>
  );
}
