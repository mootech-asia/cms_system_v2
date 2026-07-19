<script setup lang="ts">
const site = useSiteStore();
</script>

<template>
  <div>
    <BlockRenderer :sections="site.sectionsFor('home')" />
  </div>
</template>
