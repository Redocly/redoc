import { OpenAPIContact, OpenAPIInfo, OpenAPILicense } from '../../types';
import { IS_BROWSER } from '../../utils/';
import { OpenAPIParser } from '../OpenAPIParser';

export class ApiInfoModel implements OpenAPIInfo {
  title: string;
  version: string;

  description: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;

  downloadLink?: string;
  downloadFileName?: string;

  constructor(private parser: OpenAPIParser) {
    Object.assign(this, parser.spec.info);
    this.description = parser.spec.info.description || '';

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
      const blob = new Blob([JSON.stringify(this.parser.spec, null, 2)], {
        type: 'application/json',
      });
      return window.URL.createObjectURL(blob);
    }
  }

  private getDownloadFileName(): string | undefined {
    if (!this.parser.specUrl) {
      return 'swagger.json';
    }
    return undefined;
  }
}
