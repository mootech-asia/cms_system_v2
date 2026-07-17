<script setup lang="ts">
/**
 * MiniGamesGrid 變體 v2:分頁改為藥丸按鈕(取代 v1 的底線指示器),
 * 遊戲縮圖改為自動換行的網格(取代水平捲動軌道)。
 * 吃同一份 content store(miniCategories)內容與皮膚 token。
 */
import { ref, computed } from 'vue';


const content = useContentStore();
const { t, localizeMiniTabs } = useLocale();
const tabs = computed(() => localizeMiniTabs(content.miniCategories));

const active = ref(content.miniCategories[0]?.key ?? 'mini');
const games = computed(() => tabs.value.find((item) => item.key === active.value)?.games ?? []);
const routes = computed<Record<string, string>>(() => Object.fromEntries(tabs.value.map((item) => [item.key, item.route])));
const mediaSrc = (src: string) => (/^(https?:)?\/\//.test(src) ? src : withBase(src));

const pillClass = (key: string) =>
  key === active.value
    ? 'bg-g-primary text-on-primary'
    : 'bg-surface text-ink-3 hover:text-ink-2';
</script>

<template>
  <section class="py-12 bg-surface-deep">
    <div class="container mx-auto px-4">
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-2">
          <button
            v-for="t in tabs" :key="t.key" type="button"
            class="px-4 py-1.5 rounded-full text-xs md:text-sm transition-colors"
            :class="pillClass(t.key)"
            @click="active = t.key"
          >{{ t.label }}</button>
        </div>
        <NuxtLink class="text-ink-3 hover:text-ink text-xs px-3 py-1.5 border border-line rounded transition-colors self-start md:self-auto" :to="routes[active]">{{ t('action.showAll') }}</NuxtLink>
      </div>
      <div :key="active" class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 animate-slideIn">
        <div v-for="g in games" :key="g.title" class="cursor-pointer group">
          <div class="aspect-square rounded-lg overflow-hidden border-2 border-line group-hover:border-primary transition-colors">
            <img :src="mediaSrc(g.img)" :alt="g.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" :style="{ objectPosition: g.focalPoint || 'center' }" loading="lazy">
          </div>
          <h3 class="text-ink text-xs text-center mt-2 truncate">{{ g.title }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>
