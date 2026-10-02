<script lang="ts">
  import { onMount } from 'svelte';
  import { init } from 'redoc/bundles/redoc.standalone.js';

  let { specUrl }: { specUrl: string } = $props();

  let container: HTMLElement;

  onMount(() => {
    init(specUrl, {}, container);
  });
</script>

<div bind:this={container}></div>
