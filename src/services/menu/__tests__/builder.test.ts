import { normalizeOptions } from '../../config-options';
import { OpenAPIParser } from '../../OpenAPIParser';
import { buildMenuStructure } from '../builder';
import { addMarkdownItems } from '../markdown';

const opts = normalizeOptions({});

describe('Menu', () => {
  describe('builder', () => {
    let parser;

    test('should resolve pathItems', async () => {
      const spec = (await import('./fixtures/pathItems.json')).default;
      parser = new OpenAPIParser(spec, undefined, opts);
      const contentItems = buildMenuStructure(parser, opts);
      expect(contentItems).toHaveLength(3);
      expect(contentItems[1].items).toHaveLength(1);
      expect(contentItems[1].id).toEqual('pet2');
      expect(contentItems[1].name).toEqual('pet2');
      expect(contentItems[1].type).toEqual('tag');
      expect(contentItems[2].items).toHaveLength(1);
      expect(contentItems[2].id).toEqual('pet');
      expect(contentItems[2].name).toEqual('pet');
      expect(contentItems[2].type).toEqual('tag');
    });
  });

  describe('addMarkdownItems', () => {
    test('should resolve heading with children', () => {
      const markdown = `# [Petstore sample](http://petstore.swagger.io/) provided by [swagger.io](http://swagger.io) team `;

      const contentItems = addMarkdownItems(markdown, undefined, 1);
      expect(contentItems[0].name).toEqual('Petstore sample');
    });

    test('should resolve headings with custom id', () => {
      const markdown = `# Petstore sample team {% #my-id %}`;

      const contentItems = addMarkdownItems(markdown, undefined, 1);
      expect(contentItems[0].name).toEqual('Petstore sample team ');
      expect(contentItems[0].id).toEqual('my-id');
    });

    test('should create a menu item from a level 2 header', () => {
      const markdown = `## Custom section 1 \n Nullam pretium erat ut augue mollis, id varius orci pretium.`;

      const contentItems = addMarkdownItems(
        markdown,
        {
          id: 'pet',
          type: 'tag',
          items: [],
          name: 'user',
          level: 1,
          depth: 1,
          href: 'pet',
        },
        2,
      );

      expect(contentItems[0]?.['ast']?.length).toEqual(2);
    });

    test.each([['# Users'], ['## Users'], ['### Users'], ['#### Users'], ['##### Users']])(
      'should handle identical headers of different levels across different tag descriptions %s',
      (markdown) => {
        const resultA = addMarkdownItems(
          markdown,
          {
            id: 'tag-a',
            type: 'tag',
            items: [],
            name: 'Tag A',
            level: 1,
            depth: 1,
            href: 'tag-a',
          },
          0,
        );

        const resultB = addMarkdownItems(
          markdown,
          {
            id: 'tag-b',
            type: 'tag',
            items: [],
            name: 'Tag B',
            level: 1,
            depth: 1,
            href: 'tag-b',
          },
          0,
        );

        expect(resultA[0].id).toEqual('tag-a/users');
        expect(resultB[0].id).toEqual('tag-b/users');
      },
    );
  });
});
