import { Component, afterNextRender, input, viewChild } from '@angular/core';

import type { ElementRef } from '@angular/core';

@Component({
  selector: 'app-redoc-view',
  template: '<div #container></div>',
})
export class RedocView {
  readonly specUrl = input.required<string>();

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');

  constructor() {
    afterNextRender(async () => {
      const { init } = await import('redoc/bundles/redoc.standalone.js');
      init(this.specUrl(), {}, this.container().nativeElement);
    });
  }
}
