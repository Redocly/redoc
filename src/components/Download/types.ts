export type DownloadUrlsConfig = {
  title?: string;
  url: string;
}[];

export type DownloadIconType = 'yaml' | 'json' | 'file';

export type UseDownloadInfoProps = {
  definitionUrl?: string;
  downloadUrls?: DownloadUrlsConfig;
  defaultFileName?: string;
};

export type UseDownloadInfoReturnType = {
  title: string;
  url: string;
  iconType: DownloadIconType;
}[];
