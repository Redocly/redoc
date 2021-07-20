import * as path from 'path';
import * as yaml from 'js-yaml'
import { OpenAPIContact, OpenAPIInfo, OpenAPILicense } from '../../types';
import { IS_BROWSER } from '../../utils/';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

export class ApiInfoModel implements OpenAPIInfo {
  title: string;
  version: string;

  description: string;
  summary: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;

  downloadLink?: string;
  downloadFileName?: string;

  constructor(
    private parser: OpenAPIParser,
    private options: RedocNormalizedOptions = new RedocNormalizedOptions({}),
  ) {
    Object.assign(this, parser.spec.info);
    this.description = parser.spec.info.description || '';
    this.summary = parser.spec.info.summary || '';

    const firstHeadingLinePos = this.description.search(/^##?\s+/m);
    if (firstHeadingLinePos > -1) {
      this.description = this.description.substring(0, firstHeadingLinePos);
    }

    this.downloadLink = this.getDownloadLink();
    this.downloadFileName = this.getDownloadFileName();
  }

  private getDownloadLink(): string | undefined {
    if (this.parser.specUrl) {
      return this.parser.specUrl;
    }

    if (IS_BROWSER && window.Blob && window.URL && window.URL.createObjectURL) {
      let specString: string;
      if (path.extname(this.options.downloadFileName) === '.yaml') {
        specString = yaml.safeDump(this.parser.spec);
      } else {
        specString = JSON.stringify(this.parser.spec, null, 2);
      }
      const blob = new Blob([specString], {
        type: 'application/json',
      });
      return window.URL.createObjectURL(blob);
    }
  }

  private getDownloadFileName(): string | undefined {
    if (!this.parser.specUrl) {
      return this.options.downloadFileName;
    }
    return undefined;
  }
}
