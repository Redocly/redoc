import { querySelector, html2Str, IS_BROWSER } from '../dom';

describe('DOM utils', () => {
  describe('querySelector', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should return element when document is defined', () => {
      document.body.innerHTML = '<div></div>';
      const div = querySelector('div');
      expect(div).not.toBeNull();
      expect(div?.tagName).toBe('DIV');
    });

    it('should return null for non-existent element', () => {
      document.body.innerHTML = '<div></div>';
      const span = querySelector('span');
      expect(span).toBeNull();
    });
    it('should return null when document is undefined', () => {
      expect(querySelector('div')).toBeNull();
    });
  });

  describe('html2Str', () => {
    it('should remove tags and keep text', () => {
      expect(html2Str('<div><p>Hello</p> <span>World</span></div>')).toBe('Hello World');
    });

    it('should handle multiple spaces between chunks', () => {
      expect(html2Str('<div> chunk1 </div> <div> chunk2 </div>')).toBe('chunk1 chunk2');
    });

    it('should return an empty string for empty input', () => {
      expect(html2Str('')).toBe('');
    });
    it('should remove tags and newlines from HTML', () => {
      expect(html2Str('<div>Hello\n<span>world</span></div>')).toBe('Hello world');
    });

    it('should return an empty string if input is empty', () => {
      expect(html2Str('')).toBe('');
    });
  });

  describe('IS_BROWSER', () => {
    it('should be true in a browser-like environment', () => {
      expect(IS_BROWSER).toBe(true);
    });
  });

  describe('scrollIntoViewIfNeeded polyfill', () => {
    let parent: HTMLElement;
    let child: HTMLElement;

    beforeEach(() => {
      parent = document.createElement('div');
      child = document.createElement('div');
      parent.appendChild(child);
      document.body.appendChild(parent);

      jest.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: (prop: string) => {
          if (prop === 'border-top-width') return '10';
          if (prop === 'border-left-width') return '10';
          return '0';
        },
      } as any);

      Object.defineProperties(parent, {
        offsetTop: { value: 100, configurable: true },
        offsetLeft: { value: 100, configurable: true },
        scrollTop: { value: 100, configurable: true, writable: true },
        scrollLeft: { value: 100, configurable: true, writable: true },
        clientHeight: { value: 200, configurable: true },
        clientWidth: { value: 200, configurable: true },
      });

      Object.defineProperties(child, {
        offsetTop: { value: 150, configurable: true },
        offsetLeft: { value: 150, configurable: true },
        clientHeight: { value: 50, configurable: true },
        clientWidth: { value: 50, configurable: true },
        scrollIntoView: { value: jest.fn(), configurable: true },
      });

      if (typeof Element.prototype.scrollIntoViewIfNeeded !== 'function') {
        require('../dom');
      }
    });

    afterEach(() => {
      if (parent.parentNode) {
        parent.parentNode.removeChild(parent);
      }
      jest.restoreAllMocks();
    });

    it('should center the element when over top and centerIfNeeded is true', () => {
      Object.defineProperty(child, 'offsetTop', { value: 50 });
      (child as any).scrollIntoViewIfNeeded(true);
      expect(parent.scrollTop).toBe(-135);
    });

    it('should center the element when over bottom and centerIfNeeded is true', () => {
      Object.defineProperty(child, 'offsetTop', { value: 350 });
      (child as any).scrollIntoViewIfNeeded(true);
      expect(parent.scrollTop).toBe(100);
    });

    it('should scroll into view when over left and centerIfNeeded is false', () => {
      Object.defineProperty(child, 'offsetLeft', { value: 50 });
      (child as any).scrollIntoViewIfNeeded(false);
      expect(child.scrollIntoView).toHaveBeenCalled();
    });

    it('should scroll into view when over right and centerIfNeeded is false', () => {
      Object.defineProperty(child, 'offsetLeft', { value: 350 });
      (child as any).scrollIntoViewIfNeeded(false);
      expect(child.scrollIntoView).toHaveBeenCalled();
    });
  });
});
