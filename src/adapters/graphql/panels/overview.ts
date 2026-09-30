import type { OverviewNode } from '../../../types/content.js';
import type { ApiDocsOptions } from '../../../types/options.js';

import { panelKind } from '../../../types/common.js';

export function buildOverviewPanelContent(
  info: ApiDocsOptions['info'] | undefined,
): OverviewNode | null {
  if (!info) {
    return null;
  }

  const children: OverviewNode['children'] = [];

  if (info.contact?.url) {
    children.push({
      kind: panelKind.EXTERNAL_LINK,
      title: 'URL',
      titleTranslationKey: 'info.contact.url',
      label: info.contact.url,
      url: info.contact.url,
    });
  }

  if (info.contact?.email) {
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

  if (info.license?.url && (info.license.identifier || info.license.name)) {
    children.push({
      kind: panelKind.EXTERNAL_LINK,
      title: 'License',
      titleTranslationKey: 'info.license',
      label: info.license.identifier || info.license.name || '',
      url: info.license.url,
    });
  }

  if (!info.license?.url && (info.license?.identifier || info.license?.name)) {
    children.push({
      kind: panelKind.ATTRIBUTE,
      title: 'License',
      titleTranslationKey: 'info.license',
      label: info.license?.identifier || info.license?.name || 'License',
      value: info.license?.identifier || info.license?.name || 'License',
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

  return {
    title: 'Overview',
    titleTranslationKey: 'info.title',
    children,
  };
}
