import { OpenAPIContact, OpenAPIInfo, OpenAPILicense } from '../../types';
import { isBrowser } from '../../utils/';
import { OpenAPIParser } from '../OpenAPIParser';
import { RedocNormalizedOptions } from '../RedocNormalizedOptions';

export class ApiInfoModel implements OpenAPIInfo {
  title: string;
  version: string;

  description?: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;

  constructor(private parser: OpenAPIParser, private options: RedocNormalizedOptions) {
    Object.assign(this, parser.spec.info);
  }

  get downloadLink() {
    if (this.options.hideDownloadButton) {
      return undefined;
    }

    if (this.parser.specUrl) {
      return this.parser.specUrl;
    }

    if (isBrowser && window.Blob && window.URL) {
      const blob = new Blob([JSON.stringify(this.parser.spec, null, 2)], {
        type: 'application/json',
      });
      return window.URL.createObjectURL(blob);
    } else if (!isBrowser) {
      return (
        'data:application/octet-stream;base64,' +
        new Buffer(JSON.stringify(this.parser.spec, null, 2)).toString('base64')
      );
    }
  }

  get downloadFileName(): string | undefined {
    if (!this.parser.specUrl) {
      return 'swagger.json';
    }
    return undefined;
  }
}
