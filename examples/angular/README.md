# Redoc in Angular

Angular 22 (standalone components, zoneless). Redoc has no Angular component, but the standalone
bundle's `init()` renders into any element, so `RedocView` wraps it in a few lines and renders the
Cafe API from a URL.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:4200.

## Use it in your app

```bash
npm install redoc
```

```ts
import { Component, afterNextRender, viewChild } from '@angular/core';
import { init } from 'redoc/bundles/redoc.standalone.js';

import type { ElementRef } from '@angular/core';

@Component({ selector: 'app-docs', template: '<div #container></div>' })
export class Docs {
  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');

  constructor() {
    afterNextRender(() => init('/your-api.yaml', {}, this.container().nativeElement));
  }
}
```

`src/app/redoc-view.ts`
takes a `specUrl` input; the spec type is detected from the document. The Redoc bundle is 2.7 MB, so the production build
disables Angular's default bundle budgets (`budgets: []` in `angular.json`).

## Docker

`docker/` builds the production bundle and serves it with nginx (this is also how CI tests the
example). Redoc keeps its deep links in the URL hash, so plain static hosting is enough.

```bash
docker build -f docker/Dockerfile -t redoc-angular .
docker run --rm -p 8080:80 redoc-angular
```
