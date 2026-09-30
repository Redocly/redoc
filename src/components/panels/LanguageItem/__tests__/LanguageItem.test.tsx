import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { LanguageItem } from '../LanguageItem.js';

vi.mock('@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon', () => ({
  CheckmarkIcon: () => <span data-testid="checkmark" />,
}));
vi.mock('../../../../icons/CurlIcon/CurlIcon.js', () => ({
  CurlIcon: () => <span data-testid="icon-curl" />,
}));
vi.mock('../../../../icons/PythonIcon/PythonIcon.js', () => ({
  PythonIcon: () => <span data-testid="icon-python" />,
}));
vi.mock('../../../../icons/JavaScriptIcon/JavaScriptIcon.js', () => ({
  JavaScriptIcon: () => <span data-testid="icon-javascript" />,
}));
vi.mock('../../../../icons/NodeJSIcon/NodeJSIcon.js', () => ({
  NodeJSIcon: () => <span data-testid="icon-nodejs" />,
}));
vi.mock('../../../../icons/CSharpIcon/CSharpIcon.js', () => ({
  CSharpIcon: () => <span data-testid="icon-csharp" />,
}));
vi.mock('../../../../icons/RIcon/RIcon.js', () => ({ RIcon: () => null }));
vi.mock('../../../../icons/RubyIcon/RubyIcon.js', () => ({ RubyIcon: () => null }));
vi.mock('../../../../icons/PHPIcon/PHPIcon.js', () => ({ PHPIcon: () => null }));
vi.mock('../../../../icons/GOIcon/GOIcon.js', () => ({ GOIcon: () => null }));
vi.mock('../../../../icons/JavaIcon/JavaIcon.js', () => ({ JavaIcon: () => null }));
vi.mock('../../../../icons/PayloadIcon/PayloadIcon.js', () => ({ PayloadIcon: () => null }));

afterEach(() => {
  cleanup();
});

it('should render the language title', () => {
  render(<LanguageItem item={{ key: 'Python', title: 'Python', lang: 'Python' }} />);
  expect(screen.getByText('Python')).toBeInTheDocument();
});

it('should render the icon for a known language when withIcon is true and hide it when false', () => {
  const { rerender } = render(
    <LanguageItem item={{ key: 'curl', title: 'curl', lang: 'curl' }} withIcon />,
  );
  expect(screen.getByTestId('icon-curl')).toBeInTheDocument();

  rerender(<LanguageItem item={{ key: 'curl', title: 'curl', lang: 'curl' }} withIcon={false} />);
  expect(screen.queryByTestId('icon-curl')).toBeNull();
});

it('keeps the language icon when a custom label renames the tab ({ lang: "curl", label: "kuku" })', () => {
  render(<LanguageItem item={{ key: 'kuku', title: 'kuku', lang: 'curl' }} withIcon />);
  expect(screen.getByTestId('icon-curl')).toBeInTheDocument();
  expect(screen.getByText('kuku')).toBeInTheDocument();
});

it('keeps the Node.js icon on a renamed tab rather than the JavaScript one it shares a grammar with', () => {
  render(<LanguageItem item={{ key: 'kuku', title: 'kuku', lang: 'Node.js' }} withIcon />);
  expect(screen.getByTestId('icon-nodejs')).toBeInTheDocument();
  expect(screen.queryByTestId('icon-javascript')).toBeNull();
});

it('should render checkmark only when both active and withCheckmark are true', () => {
  const { rerender } = render(
    <LanguageItem item={{ key: 'Python', title: 'Python', lang: 'Python' }} active withCheckmark />,
  );
  expect(screen.getByTestId('checkmark')).toBeInTheDocument();

  rerender(
    <LanguageItem
      item={{ key: 'Python', title: 'Python', lang: 'Python' }}
      active={false}
      withCheckmark
    />,
  );
  expect(screen.queryByTestId('checkmark')).toBeNull();

  rerender(
    <LanguageItem
      item={{ key: 'Python', title: 'Python', lang: 'Python' }}
      active
      withCheckmark={false}
    />,
  );
  expect(screen.queryByTestId('checkmark')).toBeNull();
});
