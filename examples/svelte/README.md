# Redoc in Svelte

Vite + Svelte 5 + TypeScript. Redoc has no Svelte component, but the standalone bundle's `init()`
renders into any element, so `RedocView.svelte` wraps it in a few lines and renders the Cafe API
from a URL.

## Run

```bash
npm install
npm run dev
```

That opens http://localhost:5173.

## Use it in your app

```bash
npm install redoc
```

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { init } from 'redoc/bundles/redoc.standalone.js';

  let container: HTMLElement;
  onMount(() => init('/your-api.yaml', {}, container));
</script>

<div bind:this={container}></div>
```

## Docker

`docker/` builds the production bundle and serves it with nginx (this is also how CI tests the
example). Redoc keeps its deep links in the URL hash, so plain static hosting is enough.

```bash
docker build -f docker/Dockerfile -t redoc-svelte .
docker run --rm -p 8080:80 redoc-svelte
```
