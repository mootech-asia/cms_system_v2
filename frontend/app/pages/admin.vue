<script setup lang="ts">
import { BLOCKS } from '~/config/blocks';
import { TEMPLATE } from '~/config/template';
import { themeLabel } from '~/utils/themes';
import { writePublicConfig } from '~/utils/public-config';

/**
 * R6 客戶後台:終端客戶控制系統 — 內容文案/促銷管理/區塊開關與排序/換膚。
 * 可控範圍由模板定義(config/template.ts):鎖定區塊不可動、皮膚限清單、
 * 內容僅開放模板允許的範圍。編輯直接作用於 site/content store(同一 SPA
 * session 內回站點即見);「儲存變更」為占位(接 API 時換掉 content.save)。
 * 變體選擇/新增區塊/匯出模板包是設計師工具(/studio),這裡刻意不提供。
 */
definePageMeta({ layout: false });
useHead({ title: 'CMS_後台_v2' });

const scope = TEMPLATE.client;
const siteStore = useSiteStore();
const content = useContentStore();

/** 皮膚分頁沒有獨立「儲存」按鈕,setSiteName/setSkin 本身即儲存動作 — 同步寫進前台持久化組態 */
const setSiteName = (name: string) => { siteStore.setSiteName(name); writePublicConfig(siteStore); };
const setSkin = (skin: string) => { siteStore.setSkin(skin); writePublicConfig(siteStore); };

const IMAGE_GUIDE = {
  banner: '建議尺寸：1920 × 640 px（3:1；JPG、PNG 或 WebP；人物／主體置右，左側 45% 保留文案安全區）',
  promo: '建議尺寸：1200 × 450 px（8:3；JPG、PNG 或 WebP）',
  hotGame: '建議尺寸：900 × 1200 px（3:4；JPG、PNG 或 WebP）',
  catalogGame: '建議尺寸：800 × 800 px（1:1；JPG、PNG 或 WebP）',
} as const;

const tab = ref('content');
const tabs = [
  ...(scope.editable.banners ? [{ label: '內容文案', value: 'content' }] : []),
  ...(scope.editable.promos ? [{ label: '促銷管理', value: 'promos' }] : []),
  ...(scope.editable.games ? [{ label: '遊戲管理', value: 'games' }] : []),
  { label: '版面區塊', value: 'layout' },
  ...(scope.skins.length ? [{ label: '皮膚', value: 'skin' }] : []),
];

// ---- 版面區塊(限模板授權範圍) ----
const PAGE = 'home';
const sections = computed(() => siteStore.sectionsFor(PAGE));
const isLocked = (id: string) => scope.lockedSections.includes(id);
/** 只能與相鄰的「非鎖定」區塊交換(鎖定區塊是模板版面錨點,位置不可被擠動) */
const canMove = (i: number, dir: -1 | 1) => {
  const j = i + dir;
  const cur = sections.value[i];
  const tgt = sections.value[j];
  return !!cur && !!tgt && !isLocked(cur.id) && !isLocked(tgt.id);
};

// ---- 促銷管理 ----
const newPromo = ref('');
const addPromo = () => {
  const name = newPromo.value.trim();
  if (!name) return;
  content.addPromo(name);
  newPromo.value = '';
};

// ---- 遊戲管理(上架/編輯含換圖/下架/排序) ----
const newGame = reactive({ title: '', provider: '', bonus: '', img: '' });
const addGame = () => {
  if (!newGame.title.trim()) return;
  content.addGame({
    title: newGame.title.trim(),
    provider: newGame.provider.trim() || '—',
    bonus: newGame.bonus.trim() || 'BONUS 1.0',
    img: newGame.img.trim() || content.hotGames[0]?.img || '',
  });
  Object.assign(newGame, { title: '', provider: '', bonus: '', img: '' });
};
/** 換圖共用:本機檔轉 dataURL 後回呼(純 UI 占位;正式環境改上傳 API 回寫網址) */
const readImage = (e: Event, apply: (dataUrl: string) => void) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => apply(String(reader.result));
  reader.readAsDataURL(file);
  input.value = '';
};
const pickImage = (index: number, e: Event) => readImage(e, (d) => content.updateGame(index, { img: d }));

/** 遊戲管理:分類選擇(hot = Hot Games;其餘來自 miniCategories) */
const gameCat = ref('hot');
const gameCats = computed(() => [
  { key: 'hot', label: 'Hot Games' },
  ...content.miniCategories.map((c) => ({ key: c.key, label: c.label })),
]);
const activeCatGames = computed(() => content.miniCategories.find((c) => c.key === gameCat.value)?.games ?? []);
const newCatGame = reactive({ title: '', img: '' });
const addCatGame = () => {
  if (!newCatGame.title.trim()) return;
  content.addCatalogGame(gameCat.value, {
    title: newCatGame.title.trim(),
    img: newCatGame.img.trim() || activeCatGames.value[0]?.img || '',
  });
  Object.assign(newCatGame, { title: '', img: '' });
};

// ---- 占位儲存 ----
const saved = ref(false);
const save = () => {
  content.save();
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 2500);
};
</script>

<template>
  <div class="min-h-screen bg-surface-deep">
    <!-- 頂欄 -->
    <header class="sticky top-0 z-20 flex flex-col gap-3 border-b border-line-soft bg-surface px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-2.5">
      <div class="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <NuxtLink to="/" class="shrink-0 text-note text-ink-3 hover:text-ink">← 回站點檢視</NuxtLink>
        <h1 class="min-w-0 text-body-lg font-bold text-ink sm:text-h2">
          客戶後台
          <span class="block truncate text-note font-normal text-ink-4 sm:inline">/admin · 模板 {{ TEMPLATE.name }}</span>
        </h1>
      </div>
      <div class="flex w-full min-w-0 items-center justify-between gap-2 sm:w-auto sm:justify-end">
        <UiTag v-if="saved" class="min-w-0" :label="`已儲存 ${content.savedAt}(占位)`" status="ok" />
        <UiButton class="ml-auto shrink-0 sm:ml-0" label="儲存變更" size="sm" @click="save" />
      </div>
    </header>

    <div class="container mx-auto min-w-0 max-w-4xl px-3 py-4 sm:px-4 sm:py-6">
      <UiTabs v-model="tab" :tabs="tabs">
        <!-- 內容文案:banner 輪播文案 -->
        <template #content>
          <div class="space-y-4 pt-2">
            <p class="text-note text-ink-4">首頁 Banner 輪播 — 文案編輯、上架/下架、順序調整,即時反映到站點(色彩/版面屬皮膚與變體,由模板控制)。</p>
            <UiCard v-for="(b, bi) in content.banners" :key="b.id" :title="`Slide ${bi + 1} — ${b.badge}`">
              <div class="mb-3 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="min-w-0 flex-1">
                  <div class="flex min-w-0 flex-wrap items-center gap-2">
                    <img v-if="b.img" :src="withBase(b.img)" :alt="b.title" class="h-10 w-16 shrink-0 rounded-lg border border-line-soft object-cover">
                    <span v-else class="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-note text-ink-4">藝術面</span>
                    <label class="seg-btn shrink-0 cursor-pointer" :title="IMAGE_GUIDE.banner">
                      換圖<input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="readImage($event, (d) => content.updateBanner(b.id, { img: d }))">
                    </label>
                    <button v-if="b.img" type="button" class="seg-btn shrink-0" title="移除底圖,回復預設藝術面" @click="content.updateBanner(b.id, { img: undefined })">移除圖片</button>
                  </div>
                  <p class="mt-1.5 text-[11px] leading-4 text-ink-4">{{ IMAGE_GUIDE.banner }}</p>
                </div>
                <div class="flex min-h-9 shrink-0 items-center justify-end gap-2 text-ink-4 sm:gap-1">
                  <button type="button" class="icon-btn" :disabled="bi === 0" title="上移" @click="content.moveBanner(bi, bi - 1)">↑</button>
                  <button type="button" class="icon-btn" :disabled="bi === content.banners.length - 1" title="下移" @click="content.moveBanner(bi, bi + 1)">↓</button>
                  <button type="button" class="icon-btn hover:text-danger" title="下架此 Banner" @click="content.removeBanner(b.id)">✕</button>
                </div>
              </div>
              <div class="grid gap-3 md:grid-cols-2">
                <label class="block">
                  <span class="mb-1 block text-note text-ink-3">徽章(badge)</span>
                  <UiInput :model-value="b.badge" @update:model-value="content.updateBanner(b.id, { badge: $event as string })" />
                </label>
                <label class="block">
                  <span class="mb-1 block text-note text-ink-3">按鈕文字(CTA)</span>
                  <UiInput :model-value="b.cta" @update:model-value="content.updateBanner(b.id, { cta: $event as string })" />
                </label>
                <label class="block">
                  <span class="mb-1 block text-note text-ink-3">標題</span>
                  <UiInput :model-value="b.title" @update:model-value="content.updateBanner(b.id, { title: $event as string })" />
                </label>
                <label class="block">
                  <span class="mb-1 block text-note text-ink-3">主打字(highlight)</span>
                  <UiInput :model-value="b.highlight" @update:model-value="content.updateBanner(b.id, { highlight: $event as string })" />
                </label>
                <label class="block md:col-span-2">
                  <span class="mb-1 block text-note text-ink-3">副標</span>
                  <UiInput :model-value="b.sub" @update:model-value="content.updateBanner(b.id, { sub: $event as string })" />
                </label>
              </div>
            </UiCard>
            <UiButton label="上架 Banner" size="sm" variant="ghost" @click="content.addBanner()" />
          </div>
        </template>

        <!-- 促銷管理 -->
        <template #promos>
          <div class="space-y-3 pt-2">
            <p class="text-note text-ink-4">促銷卡清單 — 新增/改名/排序/移除,即時反映到促銷區塊。</p>
            <ul class="space-y-2">
              <li
                v-for="(p, i) in content.promoCards" :key="p.id"
                class="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-2 rounded-ui border border-line-soft bg-surface p-2.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_12rem_auto]"
              >
                <img v-if="p.img" :src="withBase(p.img)" :alt="p.name" class="h-10 w-10 shrink-0 rounded-lg border border-line-soft object-cover">
                <span v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-note text-ink-4">無圖</span>
                <UiInput :model-value="p.name" class="min-w-0" @update:model-value="content.updatePromo(p.id, $event as string)" />
                <div class="col-span-2 min-w-0 border-t border-line-soft pt-2 sm:col-span-1 sm:border-0 sm:pt-0">
                  <label class="seg-btn block cursor-pointer text-center" :title="IMAGE_GUIDE.promo">
                    換圖<input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="readImage($event, (d) => content.patchPromo(p.id, { img: d }))">
                  </label>
                  <p class="mt-1 text-left text-[10px] leading-4 text-ink-4 sm:text-right">{{ IMAGE_GUIDE.promo }}</p>
                </div>
                <div class="col-span-2 flex min-h-9 items-center justify-end gap-2 sm:col-span-1 sm:gap-1">
                  <button type="button" class="icon-btn" :disabled="i === 0" title="上移" @click="content.movePromo(i, i - 1)">↑</button>
                  <button type="button" class="icon-btn" :disabled="i === content.promoCards.length - 1" title="下移" @click="content.movePromo(i, i + 1)">↓</button>
                  <button type="button" class="icon-btn hover:text-danger" title="移除促銷" @click="content.removePromo(p.id)">✕</button>
                </div>
              </li>
            </ul>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <UiInput v-model="newPromo" placeholder="新促銷名稱…" class="min-w-0 flex-1" @keyup.enter="addPromo" />
              <UiButton class="w-full sm:w-auto" label="新增促銷" size="sm" variant="ghost" :disabled="!newPromo.trim()" @click="addPromo" />
            </div>
          </div>
        </template>

        <!-- 遊戲管理:上架 / 換圖 / 下架 / 排序 -->
        <template #games>
          <div class="space-y-3 pt-2">
            <p class="text-note text-ink-4">全類型遊戲管理 — 上架、換圖(貼網址或上傳本機圖)、排序、下架,即時反映到站點。</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="c in gameCats" :key="c.key" type="button"
                class="seg-btn" :class="{ active: gameCat === c.key }"
                @click="gameCat = c.key"
              >{{ c.label }}</button>
            </div>
            <ul v-if="gameCat === 'hot'" class="space-y-2">
              <li
                v-for="(g, i) in content.hotGames" :key="`${g.title}-${i}`"
                class="grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3 rounded-ui border border-line-soft bg-surface p-2.5 lg:flex lg:items-center"
              >
                <img :src="withBase(g.img)" :alt="g.title" class="h-14 w-11 shrink-0 rounded-lg border border-line-soft object-cover">
                <div class="grid min-w-0 flex-1 grid-cols-1 gap-2 xl:grid-cols-3">
                  <UiInput :model-value="g.title" placeholder="遊戲名稱" @update:model-value="content.updateGame(i, { title: $event as string })" />
                  <UiInput :model-value="g.provider" placeholder="供應商" @update:model-value="content.updateGame(i, { provider: $event as string })" />
                  <UiInput :model-value="g.bonus" placeholder="Bonus 標籤" @update:model-value="content.updateGame(i, { bonus: $event as string })" />
                </div>
                <div class="col-span-2 min-w-0 border-t border-line-soft pt-2 lg:col-auto lg:border-0 lg:pt-0">
                  <label class="seg-btn block cursor-pointer text-center" :title="IMAGE_GUIDE.hotGame">
                    換圖<input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="pickImage(i, $event)">
                  </label>
                  <p class="mt-1 text-left text-[10px] leading-4 text-ink-4 lg:max-w-[190px] lg:text-right">{{ IMAGE_GUIDE.hotGame }}</p>
                </div>
                <div class="col-span-2 flex min-h-9 shrink-0 items-center justify-end gap-2 lg:col-auto lg:gap-1">
                  <button type="button" class="icon-btn" :disabled="i === 0" title="上移" @click="content.moveGame(i, i - 1)">↑</button>
                  <button type="button" class="icon-btn" :disabled="i === content.hotGames.length - 1" title="下移" @click="content.moveGame(i, i + 1)">↓</button>
                  <button type="button" class="icon-btn hover:text-danger" title="下架" @click="content.removeGame(i)">✕</button>
                </div>
              </li>
            </ul>
            <div v-if="gameCat === 'hot'" class="grid grid-cols-1 items-center gap-2 rounded-ui border border-line bg-surface p-2.5 lg:grid-cols-5">
              <UiInput v-model="newGame.title" placeholder="新遊戲名稱 *" />
              <UiInput v-model="newGame.provider" placeholder="供應商" />
              <UiInput v-model="newGame.bonus" placeholder="Bonus 標籤" />
              <div>
                <UiInput v-model="newGame.img" placeholder="圖片網址(可留空)" />
                <p class="mt-1 text-[10px] leading-4 text-ink-4">{{ IMAGE_GUIDE.hotGame }}</p>
              </div>
              <UiButton label="上架遊戲" size="sm" :disabled="!newGame.title.trim()" @click="addGame" />
            </div>

            <!-- Mini/Slot/Live 分類清單 -->
            <ul v-if="gameCat !== 'hot'" class="space-y-2">
              <li
                v-for="(g, i) in activeCatGames" :key="`${g.title}-${i}`"
                class="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-start gap-3 rounded-ui border border-line-soft bg-surface p-2.5 lg:flex lg:items-center"
              >
                <img :src="withBase(g.img)" :alt="g.title" class="h-12 w-12 shrink-0 rounded-lg border border-line-soft object-cover">
                <UiInput :model-value="g.title" class="min-w-0 flex-1" placeholder="遊戲名稱" @update:model-value="content.updateCatalogGame(gameCat, i, { title: $event as string })" />
                <div class="col-span-2 min-w-0 border-t border-line-soft pt-2 lg:col-auto lg:border-0 lg:pt-0">
                  <label class="seg-btn block cursor-pointer text-center" :title="IMAGE_GUIDE.catalogGame">
                    換圖<input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="readImage($event, (d) => content.updateCatalogGame(gameCat, i, { img: d }))">
                  </label>
                  <p class="mt-1 text-left text-[10px] leading-4 text-ink-4 lg:max-w-[190px] lg:text-right">{{ IMAGE_GUIDE.catalogGame }}</p>
                </div>
                <div class="col-span-2 flex min-h-9 shrink-0 items-center justify-end gap-2 lg:col-auto lg:gap-1">
                  <button type="button" class="icon-btn" :disabled="i === 0" title="上移" @click="content.moveCatalogGame(gameCat, i, i - 1)">↑</button>
                  <button type="button" class="icon-btn" :disabled="i === activeCatGames.length - 1" title="下移" @click="content.moveCatalogGame(gameCat, i, i + 1)">↓</button>
                  <button type="button" class="icon-btn hover:text-danger" title="下架" @click="content.removeCatalogGame(gameCat, i)">✕</button>
                </div>
              </li>
            </ul>
            <div v-if="gameCat !== 'hot'" class="grid grid-cols-1 items-center gap-2 rounded-ui border border-line bg-surface p-2.5 lg:grid-cols-3">
              <UiInput v-model="newCatGame.title" placeholder="新遊戲名稱 *" />
              <div>
                <UiInput v-model="newCatGame.img" placeholder="圖片網址(可留空)" />
                <p class="mt-1 text-[10px] leading-4 text-ink-4">{{ IMAGE_GUIDE.catalogGame }}</p>
              </div>
              <UiButton label="上架遊戲" size="sm" :disabled="!newCatGame.title.trim()" @click="addCatGame" />
            </div>
          </div>
        </template>

        <!-- 版面區塊:開關 + 排序(限模板授權) -->
        <template #layout>
          <div class="space-y-3 pt-2">
            <p class="text-note text-ink-4">
              首頁區塊的顯示開關與排序。標示 🔒 的區塊是模板版面錨點,由模板鎖定,不可隱藏或移動。
            </p>
            <ul class="space-y-2">
              <li
                v-for="(s, i) in sections" :key="s.id"
                class="flex flex-wrap items-center gap-2 rounded-ui border border-line-soft bg-surface px-3 py-2.5 sm:gap-3"
              >
                <span class="min-w-0 flex-1 truncate text-body font-semibold" :class="s.enabled === false ? 'text-ink-4 line-through' : 'text-ink'">
                  <span v-if="isLocked(s.id)" title="模板鎖定">🔒 </span>{{ BLOCKS[s.block]?.label ?? s.block }}
                </span>
                <template v-if="!isLocked(s.id)">
                  <span class="flex gap-1 text-ink-4">
                    <button type="button" class="px-1 hover:text-ink disabled:opacity-30" :disabled="!canMove(i, -1)" title="上移" @click="siteStore.moveSection(PAGE, i, i - 1)">↑</button>
                    <button type="button" class="px-1 hover:text-ink disabled:opacity-30" :disabled="!canMove(i, 1)" title="下移" @click="siteStore.moveSection(PAGE, i, i + 1)">↓</button>
                  </span>
                  <button
                    type="button" role="switch" :aria-checked="s.enabled !== false"
                    class="relative h-5 w-9 rounded-full transition-colors"
                    :class="s.enabled !== false ? 'bg-g-primary' : 'bg-surface-2'"
                    :title="s.enabled !== false ? '顯示中' : '已隱藏'"
                    @click="siteStore.toggleSection(PAGE, s.id)"
                  >
                    <span
                      class="absolute top-0.5 h-4 w-4 rounded-full bg-surface transition-all"
                      :class="s.enabled !== false ? 'left-[18px]' : 'left-0.5'"
                    />
                  </button>
                </template>
                <UiTag v-else label="鎖定" />
              </li>
            </ul>
          </div>
        </template>

        <!-- 皮膚(限模板允許清單)+ 站點命名 -->
        <template #skin>
          <div class="space-y-3 pt-2">
            <template v-if="scope.editable.siteName">
              <p class="text-note text-ink-4">站點名稱(命名權在你 — 顯示於瀏覽器分頁)。</p>
              <div class="flex max-w-md items-center gap-2">
                <UiInput :model-value="siteStore.siteName" class="flex-1" placeholder="站點名稱" @update:model-value="setSiteName($event as string)" />
              </div>
            </template>
            <p class="text-note text-ink-4">切換整站皮膚(此模板開放:{{ scope.skins.join(' / ') }})。</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="k in scope.skins" :key="k" type="button"
                class="seg-btn"
                :class="{ active: siteStore.skin === k }"
                @click="setSkin(k)"
              >{{ themeLabel(k) }}</button>
            </div>
          </div>
        </template>
      </UiTabs>
    </div>
  </div>
</template>
