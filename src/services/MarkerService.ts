import * as Mark from 'mark.js';

export class MarkerService {
  map: Map<Element, Mark> = new Map();

  private prevTerm: string = '';

  add(el: HTMLElement) {
    this.map.set(el, new Mark(el));
  }

  delete(el: Element) {
    this.map.delete(el);
  }

  addOnly(elements: Element[]) {
    this.map.forEach((inst, elem) => {
      if (elements.indexOf(elem) === -1) {
        inst.unmark();
        this.map.delete(elem);
      }
    });

    for (const el of elements) {
      if (!this.map.has(el)) {
        this.map.set(el, new Mark(el as HTMLElement));
      }
    }
  }

  clearAll() {
    this.unmark();
    this.map.clear();
  }

  mark(term?: string) {
    if (!term && !this.prevTerm) {
      return;
    }
    this.map.forEach(val => {
      val.unmark();
      val.mark(term || this.prevTerm);
    });
    this.prevTerm = term || this.prevTerm;
  }

  unmark() {
    this.map.forEach(val => val.unmark());
    this.prevTerm = '';
  }
}
