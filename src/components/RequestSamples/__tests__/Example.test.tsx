import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { MediaContentModel, MediaTypeModel } from '../../../models/index.js';
import type { ExampleModelsMap } from '../../Samples/index.js';

import { Example } from '../Example.js';
import { withTestProviders } from '../../../testProviders.js';

// Mock the dependencies
vi.mock('../../Samples', () => ({
  ExampleSwitch: ({
    examples,
    exampleKey,
    onChange,
  }: {
    examples: ExampleModelsMap;
    exampleKey?: string;
    onChange: (key: string) => void;
  }) => (
    <div data-testid="example-switch">
      <select
        data-testid="example-selector"
        value={exampleKey}
        onChange={(e): void => onChange(e.target.value)}
      >
        {Object.keys(examples).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  ),
  useExampleKey: vi.fn(() => ({ exampleKey: 'bee' })),
}));

import { useTelemetry, useActivateExample } from '../../../hooks/index.js';
import { useExampleKey } from '../../Samples/index.js';

vi.mock('../../../hooks', async () => ({
  ...(await vi.importActual('../../../hooks')),
  useActivateExample: vi.fn(() => vi.fn()),
  useTelemetry: vi.fn(() => ({
    sendExamplesSwitcherClickedMessage: vi.fn(),
  })),
}));

vi.mock('../../../jotai/operation', () => ({
  operationStore: vi.fn(() => ({
    toString: (): string => 'operationStore',
  })),
}));

import { useAtom } from 'jotai';

const mockUseTelemetry = vi.mocked(useTelemetry);
const mockUseActivateExample = vi.mocked(useActivateExample);
const mockUseExampleKey = vi.mocked(useExampleKey);

// Mock jotai at module level
vi.mock('jotai', async () => {
  const actual = await vi.importActual('jotai');
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

const mockUseAtom = vi.mocked(useAtom);

describe('Example component', () => {
  const mockMediaType: MediaTypeModel = {
    name: 'application/json',
    examples: {
      bee: {
        mime: 'application/json',
        value: {
          petType: 'bee',
          honeyPerDay: 3.14,
        },
        rawValue: {
          petType: 'bee',
          honeyPerDay: 3.14,
        },
      },
    },
    schema: undefined,
    isRequestType: true,
    onlyRequiredInSamples: false,
    operation: {
      pointer: '/paths/~1pet/post',
    } as MediaTypeModel['operation'],
  };

  const mockMediaContent = {
    mediaTypes: [mockMediaType],
  } as unknown as MediaContentModel;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockUseAtom.mockReturnValue([
      {
        activeExampleName: 'bee',
        activeOneOf: {},
        requestValues: { body: null },
      },
      vi.fn(),
    ] as unknown as ReturnType<typeof useAtom>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render component with single example without ExampleSwitch', () => {
    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={mockMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    expect(renderSample).toHaveBeenCalledWith();
    expect(screen.queryByTestId('example-switch')).not.toBeInTheDocument();
    expect(screen.getByTestId('sample')).toBeInTheDocument();
  });

  it('should render component without examples', () => {
    const noExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      examples: undefined,
      formExamples: undefined,
    };

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={noExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    expect(renderSample).toHaveBeenCalledWith();
    expect(screen.queryByTestId('example-switch')).not.toBeInTheDocument();
  });

  it('should render component with multiple examples and ExampleSwitch', () => {
    const multipleExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      examples: {
        bee: {
          mime: 'application/json',
          value: { petType: 'bee' },
          rawValue: { petType: 'bee' },
        },
        cat: {
          mime: 'application/json',
          value: { petType: 'cat' },
          rawValue: { petType: 'cat' },
        },
      },
    };

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    expect(screen.getByTestId('example-switch')).toBeInTheDocument();
    expect(renderSample).toHaveBeenCalledWith('bee');
  });

  it('should handle example change correctly', async () => {
    const user = userEvent.setup();
    const setOperation = vi.fn();
    const sendTelemetry = vi.fn();
    const setActivateExampleName = vi.fn();

    mockUseAtom.mockReturnValue([
      {
        activeExampleName: 'bee',
        activeOneOf: {},
        requestValues: { body: null },
      },
      setOperation,
    ] as unknown as ReturnType<typeof useAtom>);

    mockUseTelemetry.mockReturnValue({
      sendExamplesSwitcherClickedMessage: sendTelemetry,
    } as unknown as ReturnType<typeof useTelemetry>);
    mockUseActivateExample.mockReturnValue(setActivateExampleName);

    const multipleExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      examples: {
        bee: {
          mime: 'application/json',
          value: { petType: 'bee' },
          rawValue: { petType: 'bee' },
        },
        cat: {
          mime: 'application/json',
          value: { petType: 'cat' },
          rawValue: { petType: 'cat' },
        },
      },
    };

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    const selector = screen.getByTestId('example-selector');
    await user.selectOptions(selector, 'cat');

    await waitFor(() => {
      expect(sendTelemetry).toHaveBeenCalledWith({
        exampleNumber: 1,
        totalExamples: 2,
      });
      expect(setOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          activeExampleName: 'cat',
          activeOneOf: expect.any(Object),
          requestValues: { body: null },
        }),
      );
      expect(setActivateExampleName).toHaveBeenCalledWith('cat');
    });
  });

  it('should use formExamples when examples is undefined', () => {
    const formExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      examples: undefined,
      formExamples: {
        example1: {
          mime: 'application/x-www-form-urlencoded',
          value: { field: 'value1' },
          rawValue: { field: 'value1' },
        },
        example2: {
          mime: 'application/x-www-form-urlencoded',
          value: { field: 'value2' },
          rawValue: { field: 'value2' },
        },
      },
    };

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={formExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    expect(screen.getByTestId('example-switch')).toBeInTheDocument();
    expect(renderSample).toHaveBeenCalledWith('bee');
  });

  it('should memoize the component correctly', () => {
    const multipleExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      examples: {
        bee: {
          mime: 'application/json',
          value: { petType: 'bee' },
          rawValue: { petType: 'bee' },
        },
        cat: {
          mime: 'application/json',
          value: { petType: 'cat' },
          rawValue: { petType: 'cat' },
        },
      },
    };

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    const { rerender } = render(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    const initialCallCount = renderSample.mock.calls.length;

    // Rerender with the same props
    rerender(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    // The renderSample should not be called again due to memoization
    expect(renderSample.mock.calls.length).toBe(initialCallCount);
  });

  it('should use examplesPointer when provided for activeOneOf', () => {
    const customPointer = '/paths/~1pet/post/requestBody/content/application~1json';
    const multipleExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      examplesPointer: customPointer,
      examples: {
        bee: {
          mime: 'application/json',
          value: { petType: 'bee' },
          rawValue: { petType: 'bee' },
        },
        cat: {
          mime: 'application/json',
          value: { petType: 'cat' },
          rawValue: { petType: 'cat' },
        },
      },
    };

    mockUseAtom.mockReturnValue([
      {
        activeExampleName: 'cat',
        activeOneOf: { [customPointer]: 1 },
        requestValues: { body: null },
      },
      vi.fn(),
    ] as unknown as ReturnType<typeof useAtom>);

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    expect(screen.getByTestId('example-switch')).toBeInTheDocument();
    // Should render with 'cat' example since activeOneOf[customPointer] = 1
    expect(renderSample).toHaveBeenCalledWith('cat');
  });

  it('should use examplesPointer in handleExampleChange when it starts with operation pointer', async () => {
    const user = userEvent.setup();
    const setOperation = vi.fn();
    const setActivateExampleName = vi.fn();
    const sendTelemetry = vi.fn();

    const operationPointer = '/paths/~1pet/post';
    const examplesPointer = '/paths/~1pet/post/requestBody/content/application~1json';

    const multipleExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      operation: {
        ...mockMediaType.operation,
        pointer: operationPointer,
      } as MediaTypeModel['operation'],
      examplesPointer,
      examples: {
        bee: {
          mime: 'application/json',
          value: { petType: 'bee' },
          rawValue: { petType: 'bee' },
        },
        cat: {
          mime: 'application/json',
          value: { petType: 'cat' },
          rawValue: { petType: 'cat' },
        },
      },
    };

    mockUseAtom.mockReturnValue([
      {
        activeExampleName: 'bee',
        activeOneOf: {},
        requestValues: { body: null },
      },
      setOperation,
    ] as unknown as ReturnType<typeof useAtom>);

    mockUseTelemetry.mockReturnValue({
      sendExamplesSwitcherClickedMessage: sendTelemetry,
    } as unknown as ReturnType<typeof useTelemetry>);
    mockUseActivateExample.mockReturnValue(setActivateExampleName);

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    const selector = screen.getByTestId('example-selector');
    await user.selectOptions(selector, 'cat');

    await waitFor(() => {
      expect(setOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          activeExampleName: 'cat',
          activeOneOf: { [examplesPointer]: 1 },
          requestValues: { body: null },
        }),
      );
    });
  });

  it('should use operation pointer in handleExampleChange when examplesPointer does not start with operation pointer', async () => {
    const user = userEvent.setup();
    const setOperation = vi.fn();
    const setActivateExampleName = vi.fn();
    const sendTelemetry = vi.fn();

    const operationPointer = '/paths/~1pet/post';
    const examplesPointer = '/different/pointer';

    const multipleExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      operation: {
        ...mockMediaType.operation,
        pointer: operationPointer,
      } as MediaTypeModel['operation'],
      examplesPointer,
      examples: {
        bee: {
          mime: 'application/json',
          value: { petType: 'bee' },
          rawValue: { petType: 'bee' },
        },
        cat: {
          mime: 'application/json',
          value: { petType: 'cat' },
          rawValue: { petType: 'cat' },
        },
      },
    };

    mockUseAtom.mockReturnValue([
      {
        activeExampleName: 'bee',
        activeOneOf: {},
        requestValues: { body: null },
      },
      setOperation,
    ] as unknown as ReturnType<typeof useAtom>);

    mockUseTelemetry.mockReturnValue({
      sendExamplesSwitcherClickedMessage: sendTelemetry,
    } as unknown as ReturnType<typeof useTelemetry>);
    mockUseActivateExample.mockReturnValue(setActivateExampleName);

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    const selector = screen.getByTestId('example-selector');
    await user.selectOptions(selector, 'cat');

    await waitFor(() => {
      // Should use operation pointer instead of examplesPointer
      expect(setOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          activeExampleName: 'cat',
          activeOneOf: { [operationPointer]: 1 },
          requestValues: { body: null },
        }),
      );
    });
  });

  it('should fallback to activeExampleKey from useExampleKey when activeOneOf is empty', () => {
    mockUseExampleKey.mockReturnValue({ exampleKey: 'cat' });

    const multipleExamplesMediaType: MediaTypeModel = {
      ...mockMediaType,
      examples: {
        bee: {
          mime: 'application/json',
          value: { petType: 'bee' },
          rawValue: { petType: 'bee' },
        },
        cat: {
          mime: 'application/json',
          value: { petType: 'cat' },
          rawValue: { petType: 'cat' },
        },
      },
    };

    mockUseAtom.mockReturnValue([
      {
        activeExampleName: undefined,
        activeOneOf: {},
        requestValues: { body: null },
      },
      vi.fn(),
    ] as unknown as ReturnType<typeof useAtom>);

    const renderSample = vi.fn(() => <div data-testid="sample">Sample</div>);

    render(
      withTestProviders(
        <Example
          mediaType={multipleExamplesMediaType}
          mediaContent={mockMediaContent}
          renderSample={renderSample}
        />,
      ),
    );

    // Should use 'cat' from useExampleKey
    expect(renderSample).toHaveBeenCalledWith('cat');
  });
});
