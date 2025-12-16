import { useMemo } from 'react';

import type { UseDownloadInfoProps, UseDownloadInfoReturnType, DownloadIconType } from './types.js';

export const useDownloadInfo = ({
  downloadUrls,
  defaultFileName,
}: UseDownloadInfoProps): UseDownloadInfoReturnType | undefined => {
  return useMemo(() => {
    if (downloadUrls) {
      return downloadUrls.map(({ title, url }) => ({
        url,
        title: title || getFileNameFromUrl(url, defaultFileName || 'openapi.yaml'),
        iconType: getIconTypeFromUrl(url),
      }));
    }
  }, [downloadUrls, defaultFileName]);
};

function getFileNameFromUrl(url: string, defaultValue: string): string {
  const filename = url
    .split('?')[0]
    .split(/[\\\/]/) // handle backslash for Windows system
    .pop();

  if (!filename || (!filename.includes('yaml') && !filename.includes('json'))) {
    return defaultValue;
  } else {
    return filename;
  }
}

function getIconTypeFromUrl(url: string, title?: string): DownloadIconType {
  const filename =
    title ||
    url
      .split('?')[0]
      .split(/[\\\/]/) // handle backslash for Windows system
      .pop();

  if (!filename) {
    return 'file';
  }

  if (filename.includes('yaml')) {
    return 'yaml';
  } else if (filename.includes('json')) {
    return 'json';
  }

  return 'file';
}
