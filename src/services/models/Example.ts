import type { OpenAPIEncoding, OpenAPIExample, Referenced } from '../../types';
import { isFormUrlEncoded, isJsonLike, urlFormEncodePayload } from '../../utils/openapi';
import type { OpenAPIParser } from '../OpenAPIParser';

const externalExamplesCache: { [url: string]: Promise<any> } = {};

export class ExampleModel {
  value: any;
  summary?: string;
  description?: string;
  externalValueUrl?: string;

  constructor(
    parser: OpenAPIParser,
    infoOrRef: Referenced<OpenAPIExample>,
    public mime: string,
    encoding?: { [field: string]: OpenAPIEncoding },
  ) {
    const { resolved: example } = parser.deref(infoOrRef);
    this.value = example.value;
    this.summary = example.summary;
    this.description = example.description;
    if (example.externalValue) {
      this.externalValueUrl = new URL(example.externalValue, parser.specUrl).href;
    }

    if (isFormUrlEncoded(mime) && this.value && typeof this.value === 'object') {
      this.value = urlFormEncodePayload(this.value, encoding);
    }
  }

  getExternalValue(mimeType: string): Promise<any> {
    if (!this.externalValueUrl) {
      return Promise.resolve(undefined);
    }

    if (this.externalValueUrl in externalExamplesCache) {
      return externalExamplesCache[this.externalValueUrl];
    }

    externalExamplesCache[this.externalValueUrl] = fetch(this.externalValueUrl).then(res => {
      return res.text().then(txt => {
        if (!res.ok) {
          return Promise.reject(new Error(txt));
        }

        if (isJsonLike(mimeType)) {
          try {
            return JSON.parse(txt);
          } catch (e) {
            return txt;
          }
        } else {
          return txt;
        }
      });
    });

    return externalExamplesCache[this.externalValueUrl];
  }
}
