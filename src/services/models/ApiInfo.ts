import { OpenAPIContact, OpenAPIInfo, OpenAPILicense } from '../../types';
import { OpenAPIParser } from '../OpenAPIParser';

export class ApiInfoModel implements OpenAPIInfo {
  title: string;
  version: string;

  description?: string;
  termsOfService?: string;
  contact?: OpenAPIContact;
  license?: OpenAPILicense;

  constructor(public parser: OpenAPIParser) {
    Object.assign(this, parser.spec!.info);
  }

  get downloadLink() {
    if (!this.parser.specUrl && window.Blob && window.URL) {
      const blob = new Blob([JSON.stringify(this.parser.spec, null, 2)], {
        type: 'application/json',
      });
      return window.URL.createObjectURL(blob);
    }
    return this.parser.specUrl;
  }

  get downloadFileName(): string | undefined {
    if (!this.parser.specUrl && window.Blob && window.URL) {
      return 'swagger.json';
    }
    return undefined;
  }
}
