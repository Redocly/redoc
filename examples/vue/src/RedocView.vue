<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { init } from 'redoc/bundles/redoc.standalone.js';

const props = defineProps<{ specUrl: string }>();

const container = useTemplateRef<HTMLElement>('container');

onMounted(() => {
  init(props.specUrl, {}, container.value);
});
</script>

<template>
  <div ref="container"></div>
</template>
