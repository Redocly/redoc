# Redoc in Vue

Vite + Vue 3 + TypeScript. Redoc has no Vue component, but the standalone bundle's `init()` renders
into any element, so `RedocView.vue` wraps it in a few lines and renders the Cafe API from a URL.

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

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { init } from 'redoc/bundles/redoc.standalone.js';

const container = useTemplateRef<HTMLElement>('container');
onMounted(() => init('/your-api.yaml', {}, container.value));
</script>

<template><div ref="container"></div></template>
```

## Docker

`docker/` builds the production bundle and serves it with nginx (this is also how CI tests the
example). Redoc keeps its deep links in the URL hash, so plain static hosting is enough.

```bash
docker build -f docker/Dockerfile -t redoc-vue .
docker run --rm -p 8080:80 redoc-vue
```
