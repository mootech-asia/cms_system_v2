<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';

const { locale, locales, currentLocale, setLocale } = useLocale();
const siteStore = useSiteStore();
const open = ref(false);

const visibleLocales = computed(() =>
  locales.filter((item) => siteStore.publicLocales.includes(item.code))
);
watchEffect(() => {
  if (visibleLocales.value.length && !visibleLocales.value.some((item) => item.code === locale.value)) {
    setLocale(visibleLocales.value[0]!.code);
  }
});
</script>

<template>
  <div v-if="visibleLocales.length > 1" class="relative">
    <button class="text-ink-2 hover:text-ink flex items-center gap-1" @click="open = !open">
      <AppIcon name="globe" class="w-4 h-4" />
      <span>{{ currentLocale.short }}</span>
      <AppIcon name="chevron-down" class="w-3 h-3" />
    </button>
    <div v-if="open" class="fixed inset-0 z-[999]" @click="open = false"></div>
    <div v-if="open" class="dd-panel right-0">
      <div
        v-for="item in visibleLocales"
        :key="item.code"
        class="rounded-md cursor-pointer px-3.5 py-2.5 text-sm whitespace-nowrap hover:bg-surface-deep"
        :class="locale === item.code ? 'text-primary font-bold' : 'text-ink-2 font-normal'"
        @click="setLocale(item.code); open = false"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
