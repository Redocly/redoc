export function debounce<T>(
  fn: (...args: T[]) => void,
  threshold: number,
  leading?: boolean,
): (...args: T[]) => void {
  let timeout;
  let count = 0;
  return function debounced(...args) {
    count++;
    function delayed() {
      if (count > 1) {
        fn(...args);
      }
      count = 0;
      timeout = null;
    }

    if (timeout) {
      clearTimeout(timeout);
    } else if (leading) {
      fn(...args);
    }

    timeout = setTimeout(delayed, threshold);
  };
}
