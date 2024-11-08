import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import useSelectedTag from '../Virtualization/useSelectedTag';

(global as any).IS_REACT_ACT_ENVIRONMENT = true;

jest.useFakeTimers();

describe('useSelectedTag', () => {
  let container: HTMLDivElement;
  let root: ReactDOM.Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
  });

  afterEach(() => {
    React.act(() => root.unmount());
    document.body.removeChild(container);
    container = null as any;
    jest.clearAllTimers();
  });

  it('should return the correct tag based on the hash in the URL', async () => {
    window.location.hash = '#tag/product-namespace-verb';

    let selectedTag: string | undefined;

    // Hooks can only be used inside a React component.
    // This component is just to host the hook.
    const TestComponent = () => {
      selectedTag = useSelectedTag();
      return <p data-testid={selectedTag}>test</p>;
    };

    React.act(() => {
      root.render(<TestComponent />);
    });

    await React.act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(selectedTag).toBe('tag/product-namespace-verb');
  });

  it('resetting a tag will also reset the selected tag from the hook', async () => {
    let selectedTag: string | undefined;

    // Hooks can only be used inside a React component.
    // This component is just to host the hook.
    const TestComponent = () => {
      selectedTag = useSelectedTag();
      return <p data-testid={selectedTag}>test</p>;
    };

    React.act(() => {
      root.render(<TestComponent />);
    });

    expect(selectedTag).toBe('');

    window.location.hash = '#tag/product-namespace-verb';
    await React.act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(selectedTag).toBe('tag/product-namespace-verb');

    window.location.hash = '';
    await React.act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(selectedTag).toBe('');
  });

  it('should update the selected tag when hash changes in the URL', async () => {
    window.location.hash = '#tag/product-namespace-verb';

    let selectedTag: string | undefined;

    // Hooks can only be used inside a React component.
    // This component is just to host the hook.
    const TestComponent = () => {
      selectedTag = useSelectedTag();
      return null;
    };

    React.act(() => {
      root.render(<TestComponent />);
    });

    await React.act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(selectedTag).toBe('tag/product-namespace-verb');

    window.location.hash =
      '#tag/product-namespace-verb/operation/product-namespace-verb_OperationID';
    await React.act(async () => {
      jest.advanceTimersByTime(100);
    });
    expect(selectedTag).toBe(
      'tag/product-namespace-verb/operation/product-namespace-verb_OperationID',
    );
  });

  it('should clear the interval on component unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

    // Hooks can only be used inside a React component.
    // This component is just to host the hook.
    const TestComponent = () => {
      useSelectedTag();
      return null;
    };

    React.act(() => {
      root.render(<TestComponent />);
    });

    // Ensure the component is mounted
    expect(clearIntervalSpy).not.toHaveBeenCalled();

    // Unmount the component
    React.act(() => {
      root.unmount();
    });

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });
});
