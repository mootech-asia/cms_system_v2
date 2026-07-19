<script setup lang="ts">
/**
 * 皮膚切換器(header 用):層疊 icon + 下拉清單。
 * 清單自動掃 themes/*.css(THEME_KEYS),顯示業主命名(THEME_LABELS);
 * 點選即 siteStore.setSkin() 整站換皮。下拉視覺比照 header 語言選單。
 */
import { THEME_KEYS, themeLabel } from '~/utils/themes';

const siteStore = useSiteStore();
const open = ref(false);
const visibleSkins = computed(() => siteStore.publicSkins.filter((k) => THEME_KEYS.includes(k)));
const pick = (k: string) => {
  siteStore.setSkin(k);
  open.value = false;
};
</script>

<template>
  <div v-if="visibleSkins.length > 1" class="relative">
    <button
      type="button"
      class="flex items-center gap-1 text-ink-2 transition-colors hover:text-ink"
      aria-label="Switch skin"
      title="切換皮膚"
      @click="open = !open"
    >
      <AppIcon name="layers" class="h-5 w-5" />
    </button>
    <div v-if="open" class="fixed inset-0 z-[999]" @click="open = false" />
    <div
      v-if="open"
      class="dd-panel right-0"
    >
      <div
        v-for="k in visibleSkins" :key="k"
        class="cursor-pointer whitespace-nowrap rounded-md px-3.5 py-2.5 text-sm hover:bg-surface-deep"
        :class="siteStore.skin === k ? 'font-bold text-primary' : 'font-normal text-ink-2'"
        @click="pick(k)"
      >{{ themeLabel(k) }}</div>
    </div>
  </div>
</template>
