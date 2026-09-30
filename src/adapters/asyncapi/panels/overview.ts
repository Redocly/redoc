import type { AsyncApiInfo } from '../../../types/asyncapi.js';

import { type OverviewNode } from '../../../types/content.js';
import { panelKind } from '../../../types/common.js';

export function buildOverviewPanelContent(info: AsyncApiInfo): OverviewNode {
  const children: OverviewNode['children'] = [];

  if (info?.contact?.url) {
    children.push({
      kind: panelKind.EXTERNAL_LINK,
      title: 'URL',
      titleTranslationKey: 'info.contact.url',
      label: info.contact.url,
      url: info.contact.url,
    });
  }

  if (info?.contact?.email) {
    children.push({
      kind: panelKind.EMAIL,
      title: info.contact.name || 'E-mail',
      titleTranslationKey: info.contact.name ? undefined : 'info.contact.name',
      email: info.contact.email,
      label: info.contact.email,
      withCopyButton: true,
      copyContent: info.contact.email,
    });
  }

  if (info.license?.url && info.license.name) {
    children.push({
      kind: panelKind.EXTERNAL_LINK,
      title: 'License',
      titleTranslationKey: 'info.license',
      label: info.license.name,
      url: info.license.url,
    });
  } else if (info.license?.name) {
    children.push({
      kind: panelKind.ATTRIBUTE,
      title: 'License',
      titleTranslationKey: 'info.license',
      label: info.license.name,
      value: info.license.name,
    });
  }

  if (info.termsOfService) {
    children.push({
      kind: panelKind.EXTERNAL_LINK,
      label: 'Terms of Service',
      labelTranslationKey: 'info.termsOfService',
      url: info.termsOfService,
    });
  }

  const content: OverviewNode = {
    title: 'Overview',
    titleTranslationKey: 'info.title',
    children,
  };

  return content;
}
