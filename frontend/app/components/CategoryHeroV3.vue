<script setup lang="ts">
/** 類別頁 Hero v3：精簡橫幅，適合內容密度較高的列表頁。 */
const props = withDefaults(defineProps<{
  title?: string;
  image?: string;
  focalPoint?: string;
  eyebrow?: string;
}>(), {
  focalPoint: 'center',
});

const mediaSrc = (src?: string) => {
  if (!src) return '';
  return /^(https?:)?\/\//.test(src) ? src : withBase(src);
};
const hideBrokenMedia = (event: Event) => {
  (event.currentTarget as HTMLImageElement).hidden = true;
};
</script>

<template>
  <section class="category-hero-media category-hero-media--compact relative overflow-hidden bg-g-hero py-8 md:py-10">
    <img
      v-if="props.image"
      :src="mediaSrc(props.image)"
      alt=""
      aria-hidden="true"
      class="category-hero-image absolute inset-0 h-full w-full object-cover"
      :style="{ objectPosition: props.focalPoint }"
      fetchpriority="high"
      @error="hideBrokenMedia"
    >
    <div v-if="props.image" class="category-hero-scrim absolute inset-0" />
    <div class="category-hero-content container relative z-10 mx-auto px-4 text-center">
      <p v-if="props.eyebrow" class="mb-2 text-micro font-bold tracking-wide2 text-primary">
        {{ props.eyebrow }}
      </p>
      <h1 class="text-h1 font-extrabold text-ink md:text-display">
        <slot>{{ props.title }}</slot>
      </h1>
    </div>
  </section>
</template>
