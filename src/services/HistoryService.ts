import { bind, debounce } from 'decko';
import { EventEmitter } from 'eventemitter3';
import { IS_BROWSER } from '../utils/';
import { RedocNormalizedOptions } from './RedocNormalizedOptions';

const EVENT = 'hashchange';

export class HistoryService {
  private _emiter;
  private options: RedocNormalizedOptions;

  constructor(options: RedocNormalizedOptions) {
    this.options = options;
    this._emiter = new EventEmitter();
    this.bind();
  }

  get currentId(): string {
    if (IS_BROWSER) {
      if (this.shouldQueryParamNavigationBeUsed()) {
        return this.getQueryParams(window.location.search);
      } else {
        return decodeURIComponent(window.location.hash.substring(1));
      }
    }
    return '';
  }

  linkForId(id: string) {
    if (!id) {
      return '';
    }
    return this.getHrefSplitCharacter() + id;
  }

  subscribe(cb): () => void {
    const emmiter = this._emiter.addListener(EVENT, cb);
    return () => emmiter.removeListener(EVENT, cb);
  }

  emit = () => {
    this._emiter.emit(EVENT, this.currentId);
  };

  bind() {
    if (IS_BROWSER) {
      window.addEventListener('hashchange', this.emit, false);
    }
  }

  dispose() {
    if (IS_BROWSER) {
      window.removeEventListener('hashchange', this.emit);
    }
  }

  @bind
  @debounce
  replace(id: string | null, rewriteHistory: boolean = false) {
    if (!IS_BROWSER) {
      return;
    }

    if (id == null || id === this.currentId) {
      return;
    }
    if (rewriteHistory) {
      window.history.replaceState(
        null,
        '',
        window.location.href.split(this.getHrefSplitCharacter())[0] + this.linkForId(id),
      );

      return;
    }
    window.history.pushState(
      null,
      '',
      window.location.href.split(this.getHrefSplitCharacter())[0] + this.linkForId(id),
    );
    this.emit();
  }

  private shouldQueryParamNavigationBeUsed(): boolean {
    return this.options?.userQueryParamToNavigate;
  }

  private getQueryParams(search: string): string {
    const queryParams = new URLSearchParams(search);
    if (search != null) {
      return queryParams.get('redoc') != null ? (queryParams.get('redoc') as string) : '';
    }
    return '';
  }

  private getHrefSplitCharacter(): string {
    return this.shouldQueryParamNavigationBeUsed() ? '?redoc=' : '#';
  }
}
