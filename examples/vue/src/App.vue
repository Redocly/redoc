<script setup lang="ts">
import RedocView from './RedocView.vue';

const CAFE =
  'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';
</script>

<template>
  <RedocView :spec-url="CAFE" />
</template>
