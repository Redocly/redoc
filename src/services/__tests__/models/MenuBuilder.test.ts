/* eslint-disable @typescript-eslint/no-var-requires */
import { MenuBuilder } from '../../MenuBuilder';
import { OpenAPIParser } from '../../OpenAPIParser';

import { RedocNormalizedOptions } from '../../RedocNormalizedOptions';

const opts = new RedocNormalizedOptions({});

describe('Models', () => {
  describe('MenuBuilder', () => {
    let parser;

    test('should resolve pathItems', () => {
      const spec = require('../fixtures/3.1/pathItems.json');
      parser = new OpenAPIParser(spec, undefined, opts);
      const contentItems = MenuBuilder.buildStructure(parser, opts);
      expect(contentItems).toHaveLength(1);
      expect(contentItems[0].items).toHaveLength(2);
      expect(contentItems[0].id).toEqual('tag/pet');
      expect(contentItems[0].name).toEqual('pet');
      expect(contentItems[0].type).toEqual('tag');
    });
  });
});
