import type { useSiteStore } from '~/stores/site';

/**
 * 前台持久化組態(win100-public-config)。
 * /studio「套用到本站」與 /admin 皮膚分頁的換膚/命名動作會寫入這個 key;
 * app 啟動時 plugins/public-config.client.ts 讀回套進 site store,
 * 解決「設計後台設定好了,前台也沒變化」— site store 原本只在記憶體、
 * 重新整理或訪客開新分頁都看不到後台設定。
 */
export interface PublicConfig {
  siteName: string;
  skin: string;
  publicSkins: string[];
  publicLocales: string[];
  chrome: { header: string; footer: string };
}

export const PUBLIC_CONFIG_KEY = 'win100-public-config';

type SiteStore = ReturnType<typeof useSiteStore>;

export function buildPublicConfig(store: SiteStore): PublicConfig {
  return JSON.parse(JSON.stringify({
    siteName: store.siteName,
    skin: store.skin,
    publicSkins: store.publicSkins,
    publicLocales: store.publicLocales,
    chrome: store.chrome,
  }));
}

/** /studio、/admin 的儲存/套用動作呼叫:寫入 localStorage,前台/其他分頁靠 storage 事件同步 */
export function writePublicConfig(store: SiteStore) {
  if (!import.meta.client) return;
  localStorage.setItem(PUBLIC_CONFIG_KEY, JSON.stringify(buildPublicConfig(store)));
}

export function readPublicConfig(): PublicConfig | null {
  if (!import.meta.client) return null;
  try {
    const raw = localStorage.getItem(PUBLIC_CONFIG_KEY);
    if (!raw) return null;
    const config = JSON.parse(raw) as PublicConfig;
    config.publicSkins ??= [];
    config.publicLocales ??= [];
    return config;
  } catch {
    return null;
  }
}

/** 前台 client plugin 啟動套用 / storage 事件跨分頁同步呼叫 */
export function applyPublicConfig(store: SiteStore, config: PublicConfig) {
  if (config.siteName?.trim()) store.setSiteName(config.siteName);
  if (config.skin) store.setSkin(config.skin);
  store.setPublicSkins(config.publicSkins ?? []);
  store.setPublicLocales(config.publicLocales ?? []);
  if (config.chrome) store.chrome = { ...config.chrome };
}
