import { bind, debounce } from 'decko';
import { EventEmitter } from 'eventemitter3';
import { IS_BROWSER } from '../utils/';

const EVENT = 'hashchange';

function isSameHash(a: string, b: string): boolean {
  return a === b || '#' + a === b || a === '#' + b;
}

class IntHistoryService {
  private causedHashChange: boolean = false;
  private _emiter;

  constructor() {
    this._emiter = new EventEmitter();
    this.bind();
  }

  get hash(): string {
    return IS_BROWSER ? window.location.hash : '';
  }

  subscribe(cb): () => void {
    const emmiter = this._emiter.addListener(EVENT, cb);
    return () => emmiter.removeListener(EVENT, cb);
  }

  emit = () => {
    if (this.causedHashChange) {
      this.causedHashChange = false;
      return;
    }
    this._emiter.emit(EVENT, this.hash);
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
    this.causedHashChange = false;
  }

  @bind
  @debounce
  update(hash: string | null, rewriteHistory: boolean = false) {
    if (hash == null || isSameHash(hash, this.hash)) {
      return;
    }
    if (rewriteHistory) {
      if (IS_BROWSER) {
        window.history.replaceState(null, '', window.location.href.split('#')[0] + '#' + hash);
      }
      return;
    }
    this.causedHashChange = true;
    if (IS_BROWSER) {
      window.location.hash = hash;
    }
  }
}

export const HistoryService = new IntHistoryService();

if (module.hot) {
  module.hot.dispose(() => {
    HistoryService.dispose();
  });
}
