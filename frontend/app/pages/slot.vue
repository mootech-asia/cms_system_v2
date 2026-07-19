<script setup lang="ts">
import { CATEGORY_HERO_MEDIA } from '~/config/operational-media';
</script>

<template>
  <div>
    <CategoryHero
      title="SLOT MACHINES"
      :image="CATEGORY_HERO_MEDIA.slot.image"
      :focal-point="CATEGORY_HERO_MEDIA.slot.focalPoint"
      :eyebrow="CATEGORY_HERO_MEDIA.slot.eyebrow"
    />
    <VendorBrowser title="Slot Games" kind="slot" />
  </div>
</template>
