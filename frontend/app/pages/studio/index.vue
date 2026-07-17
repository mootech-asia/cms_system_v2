<script setup lang="ts">
import { BLOCKS, type BlockKey } from '~/config/blocks';
import { TEMPLATE } from '~/config/template';
import { THEME_KEYS, fetchThemeSource, themeLabel } from '~/utils/themes';
import {
  type DraftConfig, buildDraft, applyDraft, writeDraft,
} from '~/utils/studio-draft';
import { writePublicConfig } from '~/utils/public-config';
import { APP_LOCALES } from '~/composables/useLocale';
import { makeZip } from '~/utils/zip';

/**
 * R5 設計後台:換膚/選變體/拖拉排序/顯示開關/即時預覽/匯出模板包。
 * 編輯對象是 draft(localStorage 同步給 preview iframe),
 * 「套用到本站」才寫回 site store;持久化 API 為占位。
 */
definePageMeta({ layout: false });
useHead({ title: 'CMS_設計後台_v2' });

const siteStore = useSiteStore();
const { locale, locales, setLocale } = useLocale();

// ---- 草稿 ----
// 一律從目前 store 狀態起始(localStorage 只是傳給 preview iframe 的通道,
// 不做跨 session 草稿還原 — store 本身是記憶體占位,還原舊草稿只會與站點脫節)
const draft = reactive<DraftConfig>(buildDraft(siteStore));
watch(draft, () => writeDraft(draft), { deep: true, immediate: true });

const page = ref<string>(Object.keys(draft.pages)[0] ?? 'home');
const sections = computed(() => draft.pages[page.value]?.sections ?? []);

const isPublicSkin = (skin: string) => draft.publicSkins.includes(skin);
const togglePublicSkin = (skin: string) => {
  const next = new Set(draft.publicSkins);
  if (next.has(skin)) next.delete(skin);
  else next.add(skin);
  draft.publicSkins = THEME_KEYS.filter((key) => next.has(key));
};
const publicSkinSummary = computed(() =>
  draft.publicSkins.length > 1
    ? `前台顯示 ${draft.publicSkins.length} 種`
    : '前台 skin 選擇藏起來',
);

const isPublicLocale = (code: string) => draft.publicLocales.includes(code);
const togglePublicLocale = (code: string) => {
  const next = new Set(draft.publicLocales);
  if (next.has(code)) {
    if (next.size <= 1) return; // 至少保留 1 個語言
    next.delete(code);
  } else {
    next.add(code);
  }
  draft.publicLocales = APP_LOCALES.filter((item) => next.has(item.code)).map((item) => item.code);
};
const publicLocaleSummary = computed(() =>
  draft.publicLocales.length > 1
    ? `前台顯示 ${draft.publicLocales.length} 種語言`
    : '前台語言切換藏起來',
);

// ---- 側欄群組收合(預設第一組展開) ----
const openGroups = reactive({ site: true, skin: false, chrome: false, sections: false });
const toggleGroup = (key: keyof typeof openGroups) => { openGroups[key] = !openGroups[key]; };
const localeLabel = computed(() => locales.find((l) => l.code === locale.value)?.label ?? locale.value);
const skinSummary = computed(() => `${themeLabel(draft.skin)} ・ ${publicSkinSummary.value} ・ ${publicLocaleSummary.value}`);
const chromeSummary = computed(() => `header:${draft.chrome.header} / footer:${draft.chrome.footer}`);
const sectionsSummary = computed(() => `${sections.value.length} 個區塊`);

// ---- 區塊操作 ----
const variantKeys = (block: BlockKey) => Object.keys(BLOCKS[block]?.variants ?? {});

const move = (from: number, to: number) => {
  const list = sections.value;
  if (to < 0 || to >= list.length || !list[from]) return;
  const [s] = list.splice(from, 1);
  list.splice(to, 0, s!);
};

const removeSection = (i: number) => { sections.value.splice(i, 1); };

/** 可加入頁面的區塊(chrome 由下方獨立控制) */
const ADDABLE = (Object.keys(BLOCKS) as BlockKey[]).filter((k) => !k.startsWith('site-'));
/** 需要 props 的區塊,加入時給示範值(內容編輯屬 R6 客戶後台) */
const DEFAULT_PROPS: Partial<Record<BlockKey, Record<string, unknown>>> = {
  'category-hero': { title: 'NEW SECTION' },
  'member-card': { bank: 'KB Bank', accountTail: '＊＊＊＊1234', holder: 'M＊＊＊＊＊＊＊', bindDate: '2025-08-14' },
};
const addPick = ref<BlockKey | null>(null);
const addSection = () => {
  if (!addPick.value) return;
  const id = `${addPick.value}-${Date.now().toString(36)}`;
  sections.value.push({ id, block: addPick.value, variant: 'v1', props: DEFAULT_PROPS[addPick.value] });
  addPick.value = null;
};

// ---- 拖拉排序 ----
const dragIdx = ref<number | null>(null);
const overIdx = ref<number | null>(null);
const onDrop = () => {
  if (dragIdx.value !== null && overIdx.value !== null && dragIdx.value !== overIdx.value) {
    move(dragIdx.value, overIdx.value);
  }
  dragIdx.value = null;
  overIdx.value = null;
};

// ---- 預覽 ----
const previewWidth = ref<'desktop' | 'mobile'>('desktop');
const studioPane = ref<'controls' | 'preview'>('controls');
const previewSrc = computed(() => withBase(`/studio/preview?page=${page.value}`));
const iframeEl = ref<HTMLIFrameElement | null>(null);

// ---- 套用 / 重設 / 匯出 ----
const applied = ref(false);
const applyToSite = () => {
  applyDraft(siteStore, JSON.parse(JSON.stringify(draft)));
  writePublicConfig(siteStore);
  applied.value = true;
  setTimeout(() => { applied.value = false; }, 2500);
};
const resetDraft = () => {
  const fresh = buildDraft(siteStore);
  draft.skin = fresh.skin;
  draft.publicSkins = fresh.publicSkins;
  draft.publicLocales = fresh.publicLocales;
  draft.chrome = fresh.chrome;
  draft.pages = fresh.pages;
};

const exportError = ref('');
const exportPack = async () => {
  exportError.value = '';
  const exportSkins = [...new Set([draft.skin, ...draft.publicSkins])];
  const themeFiles: { name: string; content: string }[] = [];
  for (const skin of exportSkins) {
    try {
      themeFiles.push({ name: `themes/${skin}.css`, content: await fetchThemeSource(skin) });
    } catch {
      exportError.value = `讀不到皮膚檔 themes/${skin}.css,已中止匯出`;
      return;
    }
  }
  const config = JSON.stringify(draft, null, 2);
  const readme = `# WIN100 模板包(/studio 匯出)

匯出時間:${new Date().toISOString()}
皮膚:${draft.skin}
前台可見 skins:${draft.publicSkins.length ? draft.publicSkins.join(' / ') : '不顯示'}

## 內容
- \`page-config.json\` — 站點組態:skin、chrome(header/footer 變體)、
  publicSkins(前台可見 skin 清單)、各頁 sections(順序 = 渲染順序;block/variant/enabled/props,
  schema 見 frontend/app/config/blocks.ts 的 SectionConfig)。
- \`themes/*.css\` — 已套用 skin 與前台可見 skins 的 CSS 變數檔。

## 工程接手方式
1. 皮膚:放到 \`frontend/app/assets/css/themes/\`(檔名即 skin key;
   選擇器 \`:root[data-theme="<key>"]\`,預設皮用 \`:root\`)。
2. 組態:把 page-config.json 的內容載入 site store
   (\`frontend/app/stores/site.ts\`)— 目前為記憶體占位,
   正式環境改為 API 載入/儲存即可,渲染端(BlockRenderer/layout)不用動。
3. 區塊/變體對應表在 \`frontend/app/config/blocks.ts\`;
   變體規範(v1 不可動、同內容同皮膚)見該檔註解與 docs/style-guide.md。
`;
  const blob = makeZip([
    { name: 'README.md', content: readme },
    { name: 'page-config.json', content: config },
    ...themeFiles,
  ]);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${TEMPLATE.name}-template-${draft.skin}.zip`;
  a.click();
  URL.revokeObjectURL(a.href);
};
</script>

<template>
  <div class="flex h-[100dvh] min-h-[32rem] flex-col overflow-hidden bg-surface-deep">
    <!-- 頂欄 -->
    <header class="z-20 flex shrink-0 flex-col gap-3 border-b border-line-soft bg-surface px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-4 sm:py-2.5">
      <div class="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <NuxtLink to="/" class="shrink-0 text-note text-ink-3 hover:text-ink">← 回站點</NuxtLink>
        <h1 class="min-w-0 text-body-lg font-bold text-ink sm:text-h2">
          設計後台 <span class="text-note font-normal text-ink-4">/studio</span>
        </h1>
      </div>
      <div class="grid w-full grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:ml-auto sm:flex sm:w-auto">
        <UiButton class="w-full" label="重設草稿" variant="ghost" size="sm" @click="resetDraft" />
        <UiButton class="w-full" label="套用到本站" variant="ghost" size="sm" @click="applyToSite" />
        <UiButton class="w-full min-[360px]:col-span-2 sm:w-auto" label="匯出模板包" size="sm" @click="exportPack" />
      </div>
      <div v-if="applied || exportError" class="flex w-full min-w-0 flex-wrap gap-2">
        <UiTag v-if="applied" label="已套用(儲存 API 為占位)" status="ok" />
        <UiTag v-if="exportError" class="max-w-full" :label="exportError" status="bad" />
      </div>
    </header>

    <!-- 手機工作區切換:窄螢幕只顯示一個主要任務,避免控制欄與 iframe 互相擠壓 -->
    <nav class="grid shrink-0 grid-cols-2 gap-1 border-b border-line-soft bg-surface px-3 py-2 lg:hidden" aria-label="設計後台工作區">
      <button
        type="button"
        class="seg-btn"
        :class="{ active: studioPane === 'controls' }"
        @click="studioPane = 'controls'"
      >設定</button>
      <button
        type="button"
        class="seg-btn"
        :class="{ active: studioPane === 'preview' }"
        @click="studioPane = 'preview'"
      >即時預覽</button>
    </nav>

    <div class="flex min-h-0 flex-1">
      <!-- 左:控制欄 -->
      <aside
        class="min-h-0 w-full flex-1 space-y-3 overflow-y-auto border-r-0 border-line-soft bg-surface p-3 sm:p-4 lg:block lg:w-[340px] lg:flex-none lg:border-r"
        :class="studioPane === 'controls' ? 'block' : 'hidden'"
      >
        <!-- 站點名稱 + 預覽語言 -->
        <section class="collapse-sec">
          <button type="button" class="collapse-head" :aria-expanded="openGroups.site" @click="toggleGroup('site')">
            <span class="min-w-0 flex-1 text-left">
              <span class="block text-note font-bold tracking-wide2 text-ink-3">站點名稱 / 預覽語言</span>
              <span class="block truncate text-note text-ink-4">{{ draft.siteName || '未命名' }} ・ {{ localeLabel }}</span>
            </span>
            <svg class="collapse-chevron" :class="{ 'is-open': openGroups.site }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="openGroups.site" class="collapse-body space-y-4">
            <div>
              <h3 class="mb-2 text-note font-bold tracking-wide2 text-ink-3">站點名稱</h3>
              <UiInput v-model="draft.siteName" placeholder="站點名稱(瀏覽器分頁)" />
            </div>
            <div>
              <h3 class="mb-2 text-note font-bold tracking-wide2 text-ink-3">預覽語言</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in locales" :key="item.code" type="button"
                  class="seg-btn"
                  :class="{ active: locale === item.code }"
                  @click="setLocale(item.code)"
                >{{ item.label }}</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 皮膚 -->
        <section class="collapse-sec">
          <button type="button" class="collapse-head" :aria-expanded="openGroups.skin" @click="toggleGroup('skin')">
            <span class="min-w-0 flex-1 text-left">
              <span class="block text-note font-bold tracking-wide2 text-ink-3">皮膚</span>
              <span class="block truncate text-note text-ink-4">{{ skinSummary }}</span>
            </span>
            <svg class="collapse-chevron" :class="{ 'is-open': openGroups.skin }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="openGroups.skin" class="collapse-body">
            <p class="mb-2 text-note text-ink-4">本站套用</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="k in THEME_KEYS" :key="k" type="button"
                class="seg-btn"
                :class="{ active: draft.skin === k }"
                @click="draft.skin = k"
              >{{ themeLabel(k) }}</button>
            </div>
            <p class="mb-2 mt-3 text-note text-ink-4">前台可見</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="k in THEME_KEYS" :key="`public-${k}`" type="button"
                role="checkbox"
                class="seg-btn"
                :aria-checked="isPublicSkin(k)"
                :class="{ active: isPublicSkin(k) }"
                @click="togglePublicSkin(k)"
              >{{ isPublicSkin(k) ? '✓ ' : '' }}{{ themeLabel(k) }}</button>
            </div>
            <p class="mb-2 mt-3 text-note text-ink-4">前台可見語言</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in APP_LOCALES" :key="`public-locale-${item.code}`" type="button"
                role="checkbox"
                class="seg-btn"
                :aria-checked="isPublicLocale(item.code)"
                :class="{ active: isPublicLocale(item.code) }"
                @click="togglePublicLocale(item.code)"
              >{{ isPublicLocale(item.code) ? '✓ ' : '' }}{{ item.label }}</button>
            </div>
          </div>
        </section>

        <!-- 全站 chrome -->
        <section class="collapse-sec">
          <button type="button" class="collapse-head" :aria-expanded="openGroups.chrome" @click="toggleGroup('chrome')">
            <span class="min-w-0 flex-1 text-left">
              <span class="block text-note font-bold tracking-wide2 text-ink-3">全站 CHROME</span>
              <span class="block truncate text-note text-ink-4">{{ chromeSummary }}</span>
            </span>
            <svg class="collapse-chevron" :class="{ 'is-open': openGroups.chrome }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="openGroups.chrome" class="collapse-body">
            <div v-for="part in (['header', 'footer'] as const)" :key="part" class="mb-2 rounded-ui border border-line-soft bg-surface p-3 last:mb-0">
              <span class="block text-body text-ink-2">{{ BLOCKS[`site-${part}`].label }}</span>
              <div class="variant-grid mt-2">
                <button
                  v-for="vk in variantKeys(`site-${part}`)" :key="vk" type="button"
                  class="seg-btn-sm"
                  :class="{ active: draft.chrome[part] === vk }"
                  @click="draft.chrome[part] = vk"
                >{{ vk }}</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 頁面區塊 -->
        <section class="collapse-sec">
          <button type="button" class="collapse-head" :aria-expanded="openGroups.sections" @click="toggleGroup('sections')">
            <span class="min-w-0 flex-1 text-left">
              <span class="block text-note font-bold tracking-wide2 text-ink-3">頁面區塊</span>
              <span class="block truncate text-note text-ink-4">{{ page }} ・ {{ sectionsSummary }}</span>
            </span>
            <svg class="collapse-chevron" :class="{ 'is-open': openGroups.sections }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <div v-show="openGroups.sections" class="collapse-body">
            <div class="mb-2 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span class="shrink-0 whitespace-nowrap text-note font-bold tracking-wide2 text-ink-3">切換頁面</span>
              <UiSelect
                v-model="page"
                :options="Object.keys(draft.pages).map((p) => ({ label: p, value: p }))"
                option-label="label" option-value="value" class="w-full sm:w-32"
              />
            </div>

            <ul class="space-y-3">
              <li
                v-for="(s, i) in sections" :key="s.id"
                class="rounded-ui border bg-surface p-3 transition-colors"
                :class="overIdx === i && dragIdx !== null && dragIdx !== i ? 'border-primary' : 'border-line-soft'"
                draggable="true"
                @dragstart="dragIdx = i"
                @dragover.prevent="overIdx = i"
                @drop.prevent="onDrop"
                @dragend="onDrop"
              >
                <!-- 第一行:抓手 + 名稱 + 開關 + 刪除 -->
                <div class="flex items-center gap-2">
                  <span class="hidden shrink-0 cursor-grab select-none text-ink-4 lg:inline" title="拖拉排序">⠿</span>
                  <span class="min-w-0 flex-1 truncate text-body font-semibold" :class="s.enabled === false ? 'text-ink-4 line-through' : 'text-ink'">
                    {{ BLOCKS[s.block]?.label ?? s.block }}
                  </span>
                  <!-- 顯示開關 -->
                  <button
                    type="button" role="switch" :aria-checked="s.enabled !== false"
                    class="relative h-5 w-9 shrink-0 rounded-full transition-colors"
                    :class="s.enabled !== false ? 'bg-g-primary' : 'bg-surface-2'"
                    :title="s.enabled !== false ? '顯示中' : '已隱藏'"
                    @click="s.enabled = s.enabled === false"
                  >
                    <span
                      class="absolute top-0.5 h-4 w-4 rounded-full bg-surface transition-all"
                      :class="s.enabled !== false ? 'left-[18px]' : 'left-0.5'"
                    />
                  </button>
                  <button type="button" class="icon-btn-sm hover:text-danger" title="移除區塊" @click="removeSection(i)">✕</button>
                </div>

                <!-- 第二行:v1–v10 變體 chips,5 欄網格 -->
                <div class="variant-grid mt-2">
                  <button
                    v-for="vk in variantKeys(s.block)" :key="vk" type="button"
                    class="seg-btn-sm"
                    :class="{ active: (s.variant ?? 'v1') === vk }"
                    @click="s.variant = vk"
                  >{{ vk }}</button>
                </div>

                <!-- 第三行:右對齊上移/下移 -->
                <div class="mt-2 flex justify-end gap-1">
                  <button type="button" class="icon-btn-sm" :disabled="i === 0" title="上移" @click="move(i, i - 1)">↑</button>
                  <button type="button" class="icon-btn-sm" :disabled="i === sections.length - 1" title="下移" @click="move(i, i + 1)">↓</button>
                </div>
              </li>
            </ul>

            <!-- 新增區塊 -->
            <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <UiSelect
                v-model="addPick"
                :options="ADDABLE.map((k) => ({ label: BLOCKS[k].label, value: k }))"
                option-label="label" option-value="value" placeholder="從區塊庫新增…" class="min-w-0 flex-1"
              />
              <UiButton class="w-full sm:w-auto" label="新增" size="sm" variant="ghost" :disabled="!addPick" @click="addSection" />
            </div>
          </div>
        </section>
      </aside>

      <!-- 右:即時預覽 -->
      <main
        class="min-h-0 min-w-0 flex-1 flex-col"
        :class="studioPane === 'preview' ? 'flex' : 'hidden lg:flex'"
      >
        <div class="flex shrink-0 flex-col gap-2 border-b border-line-soft bg-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <span class="min-w-0 truncate text-note text-ink-3">即時預覽 — {{ page }}(iframe 真實視口)</span>
          <span class="flex shrink-0 gap-1">
            <button
              v-for="w in (['desktop', 'mobile'] as const)" :key="w" type="button"
              class="seg-btn border-0 bg-transparent"
              :class="{ active: previewWidth === w }"
              @click="previewWidth = w"
            >{{ w === 'desktop' ? '桌機' : '手機 390' }}</button>
          </span>
        </div>
        <div class="flex min-h-0 flex-1 justify-center overflow-auto bg-scrim/30 p-2 sm:p-4">
          <iframe
            ref="iframeEl"
            :src="previewSrc"
            class="h-full min-h-[20rem] max-w-full rounded-lg border border-line-soft bg-surface-deep"
            :style="{ width: previewWidth === 'mobile' ? 'min(390px, 100%)' : '100%' }"
            title="studio preview"
          />
        </div>
      </main>
    </div>
  </div>
</template>
