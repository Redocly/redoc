import { convertObj } from 'swagger2openapi';

const swagger2OpenAPICommon = require('swagger2openapi/common');
import { OpenAPISpec } from '../types';

// temporarily monkey-patch sha256 from swagger2openapi package with simpler hash function
// to not include 300KB crypto module polyfill into bundle
// TODO: remove when https://github.com/Mermade/swagger2openapi/pull/37 is merged
swagger2OpenAPICommon.sha256 = function(s) {
  let hash = 0;
  let chr;
  if (s.length === 0) return hash;
  for (let i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export function convertSwagger2OpenAPI(spec: any): Promise<OpenAPISpec> {
  return new Promise<OpenAPISpec>((resolve, reject) =>
    convertObj(spec, {}, (err, res) => {
      // TODO: log any warnings
      if (err) {
        return reject(err);
      }
      resolve(res && (res.openapi as any));
    }),
  );
}
