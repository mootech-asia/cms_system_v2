<script setup lang="ts">
import { ref } from 'vue';

const { locale, locales, currentLocale, setLocale } = useLocale();
const open = ref(false);
</script>

<template>
  <div class="relative">
    <button class="text-ink-2 hover:text-ink flex items-center gap-1" @click="open = !open">
      <AppIcon name="globe" class="w-4 h-4" />
      <span>{{ currentLocale.short }}</span>
      <AppIcon name="chevron-down" class="w-3 h-3" />
    </button>
    <div v-if="open" class="fixed inset-0 z-[999]" @click="open = false"></div>
    <div v-if="open" class="dd-panel right-0">
      <div
        v-for="item in locales"
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
