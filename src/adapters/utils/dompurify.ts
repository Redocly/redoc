import createDOMPurify from 'dompurify';
import { parseHTML } from 'linkedom';

type DOMPurifyInstance = {
  sanitize(source: string): string;
};

let domPurify: DOMPurifyInstance | undefined;

export function getDOMPurify(): DOMPurifyInstance {
  if (domPurify) {
    return domPurify;
  }

  const domPurifyFactory = createDOMPurify as unknown as {
    (window: Window): DOMPurifyInstance;
    sanitize?: (source: string) => string;
  };

  const sanitize = domPurifyFactory.sanitize;
  if (typeof sanitize === 'function') {
    domPurify = {
      sanitize: (value: string): string => sanitize(value),
    };
    return domPurify;
  }

  const windowLike =
    typeof window === 'undefined'
      ? (parseHTML('<!doctype html><html><body></body></html>').window as unknown as Window)
      : window;
  domPurify = domPurifyFactory(windowLike);
  return domPurify;
}
