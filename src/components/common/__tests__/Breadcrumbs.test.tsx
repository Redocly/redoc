import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Breadcrumbs } from '../Breadcrumbs.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const crumb = (name: string) => ({ name, href: `/${name.toLowerCase()}` });

describe('Breadcrumbs', () => {
  it('renders three crumbs in full', () => {
    render(
      <Breadcrumbs
        breadcrumbs={[crumb('Users'), crumb('Admins'), crumb('Roles')]}
        onClick={vi.fn()}
      />,
    );

    for (const name of ['Users', 'Admins', 'Roles']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('collapses four crumbs to the first and last with a "..." trigger', () => {
    render(
      <Breadcrumbs
        breadcrumbs={[crumb('Users'), crumb('Admins'), crumb('Roles'), crumb('Scopes')]}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Scopes')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('lists the middle crumbs in the dropdown and navigates to the chosen one', () => {
    const onClick = vi.fn();
    render(
      <Breadcrumbs
        breadcrumbs={[crumb('Users'), crumb('Admins'), crumb('Roles'), crumb('Scopes')]}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByText('...'));
    expect(screen.getByText('Roles')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Admins'));

    expect(onClick).toHaveBeenCalledWith('/admins');
  });

  it('truncates a name longer than the available width allows', () => {
    const longName = 'A very long breadcrumb name';
    render(<Breadcrumbs breadcrumbs={[crumb('Users'), crumb(longName)]} onClick={vi.fn()} />);

    expect(screen.queryByText(longName)).not.toBeInTheDocument();
    expect(screen.getByText(/^A very lon/)).toBeInTheDocument();
  });

  it('calls onClick with the href of a clicked crumb', () => {
    const onClick = vi.fn();
    render(<Breadcrumbs breadcrumbs={[crumb('Users'), crumb('Admins')]} onClick={onClick} />);

    fireEvent.click(screen.getByText('Users'));

    expect(onClick).toHaveBeenCalledWith('/users');
  });
});
