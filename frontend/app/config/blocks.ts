import type { Component } from 'vue';
import AppBanner from '~/components/AppBanner.vue';
import HomeTicker from '~/components/home/Ticker.vue';
import HomeSportsPromo from '~/components/home/SportsPromo.vue';
import HomeHotGamesRail from '~/components/home/HotGamesRail.vue';
import HomeMiniGamesGrid from '~/components/home/MiniGamesGrid.vue';
import HomePromotion from '~/components/home/Promotion.vue';

/**
 * 區塊登錄表 — 頁面可被後台重組的最小單位。
 * key 是穩定識別碼(存進 page-config,不可任意改名);
 * variants 是「同一內容、不同長相」的元件版本(R4 逐塊擴充至 3–5 種)。
 */
export interface BlockDef {
  /** 後台顯示名稱 */
  label: string;
  /** variant key → 元件;'v1' 為現行版面 */
  variants: Record<string, Component>;
}

export const BLOCKS = {
  'home-banner': { label: '首頁 Banner 輪播', variants: { v1: AppBanner } },
  'home-ticker': { label: '中獎跑馬燈', variants: { v1: HomeTicker } },
  'home-live-sport': { label: 'Live Sport 即時賽事', variants: { v1: HomeSportsPromo } },
  'home-hot-games': { label: 'Hot Games 熱門遊戲', variants: { v1: HomeHotGamesRail } },
  'home-mini-games': { label: '遊戲速覽(Mini/Slot/Live)', variants: { v1: HomeMiniGamesGrid } },
  'home-promotion': { label: '促銷區', variants: { v1: HomePromotion } },
} satisfies Record<string, BlockDef>;

export type BlockKey = keyof typeof BLOCKS;

/** 一個頁面區塊的組態:後台調的就是這個(順序 = 陣列順序) */
export interface SectionConfig {
  /** 頁內唯一 id(拖拉排序的 key) */
  id: string;
  block: BlockKey;
  /** 缺省 = 'v1' */
  variant?: string;
  /** 缺省 = true;後台的顯示開關 */
  enabled?: boolean;
}
