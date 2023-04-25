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
        // When the window.location.hash is not empty this means that we have clicked on
        // router that's for example stored in the description via markdown
        if (window.location.hash == '') {
          return this.getQueryParams(window.location.search);
        } else {
          return decodeURIComponent(window.location.hash.substring(1));
        }
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
    if (this.shouldQueryParamNavigationBeUsed()) {
      return this.getFullUrl(id);
    } else {
      return '#' + id;
    }
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

    // If there currentId and the ID are equal but there is still
    // a hash left when using query param navigation
    // that means that the URL hasn't been overridden
    if (
      id == null ||
      (id === this.currentId && this.checkIfThereIsHashLeftWhenQueryParamNavigationShouldBeUsed())
    ) {
      return;
    }
    if (rewriteHistory) {
      if (this.shouldQueryParamNavigationBeUsed()) {
        window.history.replaceState(null, '', this.getFullUrl(id));
      } else {
        window.history.replaceState(
          null,
          '',
          window.location.href.split('#')[0] + this.linkForId(id),
        );
      }

      return;
    }
    if (this.shouldQueryParamNavigationBeUsed()) {
      window.history.pushState(null, '', this.getFullUrl(id));
    } else {
      window.history.pushState(null, '', window.location.href.split('#')[0] + this.linkForId(id));
    }
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

  private getFullUrl(id: string): string {
    const url = this.getUrl();
    // Override the hash, so it's removed when using query param navigation
    url.hash = '';
    url.searchParams.set('redoc', id);
    return url.toString();
  }

  private getUrl(): URL {
    return new URL(window.location.href);
  }

  private checkIfThereIsHashLeftWhenQueryParamNavigationShouldBeUsed(): boolean {
    return !(this.shouldQueryParamNavigationBeUsed() && window.location.hash != '');
  }
}
