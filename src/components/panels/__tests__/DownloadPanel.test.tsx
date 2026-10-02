import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { TelemetryContext } from '../../../contexts/telemetry.js';
import { PAGE_URI } from '../../../telemetry/defaults.js';
import { DownloadPanelItem } from '../DownloadPanelItem.js';
import { panelKind } from '../../../types/common.js';

vi.mock('@redocly/theme/components/Panel/Panel', () => ({
  Panel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('@redocly/theme/components/Button/Button', () => ({
  Button: ({ icon }: { icon: React.ReactNode }) => <span>{icon}</span>,
}));
vi.mock('@redocly/theme/icons/DownloadIcon/DownloadIcon', () => ({ DownloadIcon: () => null }));
vi.mock('@redocly/theme/icons/JsonIcon/JsonIcon', () => ({
  JsonIcon: () => <span data-testid="icon-json" />,
}));
vi.mock('@redocly/theme/icons/DocumentIcon/DocumentIcon', () => ({
  DocumentIcon: () => <span data-testid="icon-file" />,
}));
vi.mock('@redocly/theme/icons/GraphqlIcon/GraphqlIcon', () => ({
  GraphqlIcon: () => <span data-testid="icon-graphql" />,
}));
vi.mock('@redocly/theme/icons/FileIcon/FileIcon', () => ({
  FileIcon: () => <span data-testid="icon-file" />,
}));
vi.mock('@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon', () => ({ CheckmarkIcon: () => null }));

afterEach(() => {
  cleanup();
});

it('should render a download link for each url', () => {
  render(
    <DownloadPanelItem
      node={{
        children: [
          { kind: panelKind.DOWNLOAD, label: 'API spec', url: '/api.yaml' },
          { kind: panelKind.DOWNLOAD, label: 'API JSON', url: '/api.json' },
        ],
      }}
    />,
  );

  expect(screen.getByRole('link', { name: 'API spec' })).toHaveAttribute('href', '/api.yaml');
  expect(screen.getByRole('link', { name: 'API JSON' })).toHaveAttribute('href', '/api.json');
});

it('should open links in a new tab with download attribute', () => {
  render(
    <DownloadPanelItem
      node={{
        children: [{ kind: panelKind.DOWNLOAD, label: 'Spec', url: '/spec.yaml' }],
      }}
    />,
  );

  const link = screen.getAllByRole('link', { name: 'Spec' })[0];
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('download');
});

it('should show the yaml icon for .yaml files', () => {
  render(
    <DownloadPanelItem
      node={{
        children: [{ kind: panelKind.DOWNLOAD, label: 'spec.yaml', url: '/spec.yaml' }],
      }}
    />,
  );
  expect(screen.getAllByTestId('icon-file')).toHaveLength(1);
});

it('should show the json icon for .json files', () => {
  render(
    <DownloadPanelItem
      node={{
        children: [{ kind: panelKind.DOWNLOAD, label: 'spec.json', url: '/spec.json' }],
      }}
    />,
  );
  expect(screen.getAllByTestId('icon-json')).toHaveLength(1);
});

it('should show the graphql icon for .graphql and .gql files', () => {
  render(
    <DownloadPanelItem
      node={{
        children: [
          { kind: panelKind.DOWNLOAD, label: 'schema.graphql', url: '/schema.graphql' },
          { kind: panelKind.DOWNLOAD, label: 'schema.gql', url: '/schema.gql' },
        ],
      }}
    />,
  );
  expect(screen.getAllByTestId('icon-graphql')).toHaveLength(2);
});

it('should fall back to the file icon for unknown extensions', () => {
  render(
    <DownloadPanelItem
      node={{
        children: [{ kind: panelKind.DOWNLOAD, label: 'readme.txt', url: '/readme.txt' }],
      }}
    />,
  );
  expect(screen.getAllByTestId('icon-file')).toHaveLength(1);
});

it('should use the file icon when the url has no extension', () => {
  render(
    <DownloadPanelItem
      node={{ children: [{ kind: panelKind.DOWNLOAD, label: '/api', url: '/api' }] }}
    />,
  );
  expect(screen.getAllByTestId('icon-file')).toHaveLength(1);
});

it('fires sendDownloadDefinitionClickedMessage with the definition URL only when the edition reports URLs', () => {
  const telemetry = { sendDownloadDefinitionClickedMessage: vi.fn() };
  render(
    <TelemetryContext.Provider value={telemetry as never}>
      <DownloadPanelItem
        node={{
          children: [{ kind: panelKind.DOWNLOAD, label: 'API spec', url: '/api.yaml' }],
        }}
      />
    </TelemetryContext.Provider>,
  );

  fireEvent.click(screen.getByRole('link', { name: 'API spec' }));

  const expected =
    PAGE_URI === undefined
      ? {
          id: `definition_${window.location.hostname}_api_spec`,
          object: 'definition',
          uri: `${window.location.origin}/api.yaml`,
        }
      : {
          id: 'downloadDefinition',
          object: 'definition',
          uri: 'urn:redocly:redoc:ui:definition:downloadDefinition',
        };
  expect(telemetry.sendDownloadDefinitionClickedMessage).toHaveBeenCalledTimes(1);
  expect(telemetry.sendDownloadDefinitionClickedMessage.mock.calls[0][0]).toEqual([expected]);
});
