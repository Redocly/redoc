import { render } from '@testing-library/react';

import type { OpenAPIInfo } from '../../../types/index.js';

import { Overview } from '../Overview.js';

const mockTranslate = (key: string, defaultValue: string) => defaultValue || key;

describe('Overview', () => {
  it('should render correctly with full data', () => {
    const info: OpenAPIInfo = {
      title: 'Test API',
      version: '1.0.0',
      description: 'Test description',
      contact: {
        name: 'Test Contact',
        url: 'https://example.com',
        email: 'test@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
        identifier: 'MIT',
      },
      termsOfService: 'https://example.com/terms',
    };

    const { container } = render(<Overview info={info} translate={mockTranslate as any} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with partial data', () => {
    const info: OpenAPIInfo = {
      title: 'Test API',
      version: '1.0.0',
    };

    const { container } = render(<Overview info={info} translate={mockTranslate as any} />);
    expect(container).toMatchSnapshot();
  });

  it('should render correctly with contact data but without a name', () => {
    const info: OpenAPIInfo = {
      title: 'Test API',
      version: '1.0.0',
      contact: {
        url: 'https://example.com',
        email: 'test@example.com',
      },
    };

    const { container } = render(<Overview info={info} translate={mockTranslate as any} />);
    expect(container).toMatchSnapshot();
  });

  it('should render license with name and url when identifier is not present', () => {
    const info: OpenAPIInfo = {
      title: 'Test API',
      version: '1.0.0',
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
    };

    const { container } = render(<Overview info={info} translate={mockTranslate as any} />);
    expect(container).toMatchSnapshot();
  });
});
