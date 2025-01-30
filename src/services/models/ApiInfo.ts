import type { OpenAPIContact, OpenAPIInfo, OpenAPILicense } from '../../types';
import { IS_BROWSER } from '../../utils/';
import { l } from '../Labels';
import type { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

export class ApiInfoModel implements OpenAPIInfo {
  title: string;
  version: string;

  description: string;
  summary: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;

  downloadUrls: {
    title?: string;
    url?: string;
  }[];
  downloadFileName?: string;

  constructor(
    private parser: OpenAPIParser,
    private options: RedocNormalizedOptions = new RedocNormalizedOptions({}),
  ) {
    Object.assign(this, parser.spec.info);
    this.description = parser.spec.info.description || '';
    this.summary = parser.spec.info.summary || '';

    const firstHeadingLinePos = this.description.search(/^\s*##?\s+/m);
    if (firstHeadingLinePos > -1) {
      this.description = this.description.substring(0, firstHeadingLinePos);
    }

    this.downloadUrls = this.getDownloadUrls();
    this.downloadFileName = this.getDownloadFileName();
  }
  private getDownloadUrls() {
    return (
      !this.options.downloadUrls
        ? [
            {
              title: l('download'),
              url: this.getDownloadLink(this.options.downloadDefinitionUrl),
            },
          ]
        : this.options.downloadUrls.map(({ title, url }) => ({
            title: title || l('download'),
            url: this.getDownloadLink(url),
          }))
    ).filter(({ title, url }) => title && url);
  }

  private getDownloadLink(url?: string): string | undefined {
    if (url) {
      return url;
    }

    if (this.parser.specUrl) {
      return this.parser.specUrl;
    }

    if (IS_BROWSER && window.Blob && window.URL && window.URL.createObjectURL) {
      const blob = new Blob([JSON.stringify(this.parser.spec, null, 2)], {
        type: 'application/json',
      });
      return window.URL.createObjectURL(blob);
    }
  }

  private getDownloadFileName(): string | undefined {
    if (!this.parser.specUrl && !this.options.downloadDefinitionUrl) {
      return this.options.downloadFileName || 'openapi.json';
    }
    return this.options.downloadFileName;
  }
}
