export class MockIntersectionObserver {
  public readonly root: Element | Document | null;
  public readonly rootMargin: string;
  public readonly thresholds: ReadonlyArray<number>;

  private viewPort: any;
  private entries: any[];
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.viewPort = options?.root ? options.root : window;
    this.entries = [];
    this.root = null;
    this.rootMargin = '0px';
    this.thresholds = [1];
    this.callback = callback;

    this.viewPort.addEventListener('scroll', this.intersect);
  }

  private intersect = () => {
    this.entries.map((entry) => {
      entry.isIntersecting = this.isInViewPort(entry.target);
    });
    this.callback(this.entries, this);
  };

  isInViewPort(target: HTMLElement): boolean {
    return target.id !== 'toc-0';
  }

  observe(target: HTMLElement): void {
    this.entries.push({ isIntersecting: false, target });
  }

  unobserve(target: HTMLElement): void {
    this.entries = this.entries.filter((ob) => ob.target !== target);
  }

  disconnect(): void {
    this.viewPort.removeEventListener('scroll', this.intersect);
    this.entries = [];
  }

  takeRecords(): any[] {
    return this.entries;
  }
}
