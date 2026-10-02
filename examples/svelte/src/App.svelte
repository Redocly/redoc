<script lang="ts">
  import RedocView from './RedocView.svelte';

  const CAFE = 'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';
</script>

<RedocView specUrl={CAFE} />
