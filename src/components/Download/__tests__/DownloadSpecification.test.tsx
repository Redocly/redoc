import { render, renderHook } from '@testing-library/react';
import util from 'util';

import { DownloadSpecification } from '../DownloadSpecification';
import { useDownloadInfo } from '../useDownloadInfo';

Object.defineProperty(global, 'TextEncoder', {
  value: util.TextEncoder,
});

describe('DownloadSpecification', () => {
  it('DownloadButton renders correctly without title', () => {
    const downloadUrls = [
      {
        url: 'downloadDefinitionUrlValue.json',
      },
      {
        url: 'downloadDefinitionUrlValue.yaml',
      },
      {
        url: 'downloadDefinitionUrlValue.txt',
      },
    ];
    const { result } = renderHook(() =>
      useDownloadInfo({
        downloadUrls,
      }),
    );
    const downloadObjects = result.current;
    const { container } = render(<DownloadSpecification downloadObjects={downloadObjects} />);

    expect(container).toMatchSnapshot();
  });

  it('DownloadButton renders correctly with title', () => {
    const downloadUrls = [
      {
        title: 'OpenAPI Description json format',
        url: 'downloadDefinitionUrlValue.json',
      },
      {
        title: 'OpenAPI Description yaml format',
        url: 'downloadDefinitionUrlValue.yaml',
      },
      {
        title: 'OpenAPI Description text format',
        url: 'downloadDefinitionUrlValue.txt',
      },
    ];
    const { result } = renderHook(() =>
      useDownloadInfo({
        downloadUrls,
      }),
    );
    const downloadObjects = result.current;

    const { container } = render(<DownloadSpecification downloadObjects={downloadObjects} />);

    expect(container).toMatchSnapshot();
  });
});
