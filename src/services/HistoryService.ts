import { bind, debounce } from 'decko';
import { EventEmitter } from 'eventemitter3';
import { IS_BROWSER } from '../utils/';

const EVENT = 'hashchange';

export class HistoryService {
  private _emiter;
  private _baseURL: string | undefined;

  constructor() {
    this._emiter = new EventEmitter();
    this.bind();
  }

  setBaseURL(baseURL: string) {
    this._baseURL = baseURL;
  }

  get baseURL(): string | undefined {
    return this._baseURL;
  }

  get currentId(): string {
    return IS_BROWSER ? decodeURIComponent(window.location.hash.substring(1)) : '';
  }

  linkForId(id: string) {
    const links: string[] = [];
    if (this._baseURL) {
      links.push(this._baseURL);
    }
    if (id) {
      links.push(id);
    }
    const link = links.join('/');
    return link === '' ? '' : '#' + link;
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
        window.location.href.split('#')[0] + this.linkForId(id),
      );

      return;
    }
    window.history.pushState(null, '', window.location.href.split('#')[0] + this.linkForId(id));
    this.emit();
  }
}

export const history = new HistoryService();

if (module.hot) {
  module.hot.dispose(() => {
    history.dispose();
  });
}
