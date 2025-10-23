import { tryDecodeURIComponent } from './string.js';

class QueryString {
  parse(query: string): Record<string, any> {
    const params: Record<string, any> = {};

    if (!query) {
      return params;
    }

    const pairs = query.startsWith('?') ? query.substring(1).split('&') : query.split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');

      if (key && value) {
        const decodedKey = tryDecodeURIComponent(key);
        const decodedValue = tryDecodeURIComponent(value);

        if (decodedKey in params) {
          if (Array.isArray(params[decodedKey])) {
            params[decodedKey].push(decodedValue);
          } else {
            params[decodedKey] = [params[decodedKey], decodedValue];
          }
        } else {
          const separators = [',', '|'];
          const separator = separators.find((sep) => decodedValue.includes(sep));

          params[decodedKey] = separator ? decodedValue.split(separator) : decodedValue;
        }
      }
    }

    return params;
  }

  stringify(
    params: Record<string, any>,
    options: { encode?: boolean; sort?: boolean } = { encode: true, sort: true },
  ): string {
    const pairs: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const encodedKey = options.encode ? encodeURIComponent(key) : key;

        if (Array.isArray(value)) {
          for (const element of value) {
            if (element) {
              const encodedValue = options.encode ? encodeURIComponent(element) : element;
              pairs.push(`${encodedKey}=${encodedValue}`);
            }
          }
        } else {
          if (value) {
            const encodedValue = options.encode ? encodeURIComponent(value) : value;
            pairs.push(`${encodedKey}=${encodedValue}`);
          }
        }
      }
    }

    if (options.sort) {
      pairs.sort();
    }

    return pairs.join('&');
  }
}

const queryString = new QueryString();

export { queryString };
