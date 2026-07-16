<script setup lang="ts">
import { CATEGORY_HERO_MEDIA } from '~/config/operational-media';
</script>

<template>
  <div>
    <CategoryHero
      :image="CATEGORY_HERO_MEDIA.miniGames.image"
      :focal-point="CATEGORY_HERO_MEDIA.miniGames.focalPoint"
      :eyebrow="CATEGORY_HERO_MEDIA.miniGames.eyebrow"
    >
      100% <span class="block md:inline">MINI GAMES</span>
    </CategoryHero>
    <VendorBrowser title="Mini Games" kind="mini-games" />
  </div>
</template>
