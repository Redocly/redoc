import { render } from '@testing-library/react';
import * as Jotai from 'jotai/index';

import { html } from '@redocly/theme/markdoc/tags/html';

import { normalizeOptions } from '../../../services/index.js';
import { Markdown } from '../Markdown.js';
import { withTestProviders } from '../../../testProviders.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('Components', () => {
  describe('Markdown', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    test('Markdown renders correctly', () => {
      const { getByText } = render(
        withTestProviders(<Markdown source={`# Heading 1\n\n[link](https://google.com)`} />),
      );
      expect(getByText('Heading 1')).toBeInTheDocument();
      expect(getByText('link')).toBeInTheDocument();
      expect(getByText('link').closest('a')).toHaveAttribute('href', 'https://google.com');
    });

    test('Markdown custom sanitize works', () => {
      const options = normalizeOptions(
        { sanitize: true },
        {
          markdocOptions: {
            tags: {
              html: html.schema,
            },
            nodes: {},
            components: {},
          },
        },
      );

      vi.spyOn(Jotai, 'useAtomValue').mockImplementation(() => {
        return options;
      });

      const { container } = render(
        withTestProviders(
          <Markdown source={`123<a href='\u2028javascript:alert(1)'>I am a dolphin too!</a>`} />,
        ),
      );

      const linkEl = container.querySelector('a');
      expect(linkEl).toBeInTheDocument();
      expect(linkEl).not.toHaveAttribute('href');
    });
  });
});
