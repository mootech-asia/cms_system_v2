import type { SectionConfig } from '~/config/blocks';
import type { useSiteStore } from '~/stores/site';

/**
 * 設計後台(/studio)草稿:studio 編輯的是這份 draft,不直接動 site store;
 * 透過 localStorage + storage 事件同步給 /studio/preview iframe 即時渲染。
 * 「套用到本站」才寫回 store(儲存 API 為占位,見 rebuild-plan §2-12)。
 */
export interface DraftConfig {
  /** 前台站名(命名權:設計端可在組版時定) */
  siteName: string;
  skin: string;
  /** 前台 header skin 切換器可顯示的 skin 清單;0/1 個時前台隱藏切換器。 */
  publicSkins: string[];
  /** 全站 chrome 變體(header/footer 不屬於頁面 sections) */
  chrome: { header: string; footer: string };
  pages: Record<string, { sections: SectionConfig[] }>;
}

export const STUDIO_DRAFT_KEY = 'win100-studio-draft';

type SiteStore = ReturnType<typeof useSiteStore>;

export function buildDraft(store: SiteStore): DraftConfig {
  return JSON.parse(JSON.stringify({
    siteName: store.siteName,
    skin: store.skin,
    publicSkins: store.publicSkins,
    chrome: store.chrome,
    pages: store.pages,
  }));
}

export function applyDraft(store: SiteStore, draft: DraftConfig) {
  if (draft.siteName?.trim()) store.siteName = draft.siteName.trim();
  store.skin = draft.skin;
  store.setPublicSkins(draft.publicSkins ?? []);
  store.chrome = { ...draft.chrome };
  store.pages = JSON.parse(JSON.stringify(draft.pages));
}

export function readDraft(): DraftConfig | null {
  if (!import.meta.client) return null;
  try {
    const raw = localStorage.getItem(STUDIO_DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as DraftConfig;
    draft.publicSkins ??= [];
    return draft;
  } catch {
    return null;
  }
}

export function writeDraft(draft: DraftConfig) {
  if (!import.meta.client) return;
  localStorage.setItem(STUDIO_DRAFT_KEY, JSON.stringify(draft));
}
