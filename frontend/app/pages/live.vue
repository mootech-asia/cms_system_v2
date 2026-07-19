<script setup lang="ts">
import { CATEGORY_HERO_MEDIA } from '~/config/operational-media';
</script>

<template>
  <div>
    <CategoryHero
      title="LIVE CASINO GAMES"
      :image="CATEGORY_HERO_MEDIA.live.image"
      :focal-point="CATEGORY_HERO_MEDIA.live.focalPoint"
      :eyebrow="CATEGORY_HERO_MEDIA.live.eyebrow"
    />
    <VendorBrowser title="Live Casino" kind="live" />
  </div>
</template>
