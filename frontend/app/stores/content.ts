import { defineStore } from 'pinia';
import {
  banners as bannerSeed,
  promoCards as promoSeed,
  hotGames as gameSeed,
  miniGamesTabs,
  miniGamesImgs,
  type Banner,
  type PromoCard,
  type HotGame,
} from '~/config/mock/home';
import { LIVE_CASINO_OPERATION_MEDIA } from '~/config/operational-media';

export interface CatalogGame { title: string; img: string; focalPoint?: string }
export interface GameCategory { key: string; label: string; route: string; games: CatalogGame[] }

/** Mini/Slot 沿用遊戲圖池;Live 使用真人荷官與實體牌桌營運素材。 */
const IMG_PREFIX = '/_external/images.unsplash.com/';
const catalogSeed: GameCategory[] = miniGamesTabs.map((t) => ({
  key: t.key,
  label: t.label,
  route: t.route,
  games: t.names.map((title, i) => {
    if (t.key === 'live') {
      const media = LIVE_CASINO_OPERATION_MEDIA.tables[i % LIVE_CASINO_OPERATION_MEDIA.tables.length]!;
      return { title, img: media.image, focalPoint: media.focalPoint };
    }

    return { title, img: IMG_PREFIX + miniGamesImgs[i % miniGamesImgs.length]! };
  }),
}));

/**
 * 站點內容 store(R6)— 客戶後台「內容文案/促銷管理」的編輯對象。
 * config/mock/home.ts 降為種子資料;區塊元件改讀這裡(banner/promotion 系列)。
 * 注意:actions 一律「就地變更」(splice/Object.assign),不得整條重新指派
 * 陣列 — 元件端持有的是陣列 reference,重新指派會斷開反應鏈。
 * 儲存為占位:正式環境改為 API 載入/寫回即可,元件不用動。
 */
export const useContentStore = defineStore('content', {
  state: () => ({
    banners: JSON.parse(JSON.stringify(bannerSeed)) as Banner[],
    promoCards: JSON.parse(JSON.stringify(promoSeed)) as PromoCard[],
    hotGames: JSON.parse(JSON.stringify(gameSeed)) as HotGame[],
    /** Mini/Slot/Live 三分類遊戲牆(客戶後台「遊戲管理」全類型涵蓋) */
    miniCategories: JSON.parse(JSON.stringify(catalogSeed)) as GameCategory[],
    /** 最近一次(占位)儲存時間,admin 顯示用 */
    savedAt: null as string | null,
  }),
  actions: {
    /** 文案編輯:就地覆寫指定 banner 的欄位 */
    updateBanner(id: number, patch: Partial<Banner>) {
      const b = this.banners.find((x) => x.id === id);
      if (b) Object.assign(b, patch);
    },
    /** 促銷管理 */
    addPromo(name: string) {
      const id = `promo-${Date.now().toString(36)}`;
      this.promoCards.push({ id, name });
    },
    removePromo(id: string) {
      const i = this.promoCards.findIndex((x) => x.id === id);
      if (i >= 0) this.promoCards.splice(i, 1);
    },
    updatePromo(id: string, name: string) {
      const p = this.promoCards.find((x) => x.id === id);
      if (p) p.name = name;
    },
    movePromo(from: number, to: number) {
      if (to < 0 || to >= this.promoCards.length || !this.promoCards[from]) return;
      const [p] = this.promoCards.splice(from, 1);
      this.promoCards.splice(to, 0, p!);
    },
    /** Banner 上架/下架/排序(2026-07-17) */
    addBanner() {
      const id = Math.max(0, ...this.banners.map((b) => b.id)) + 1;
      this.banners.push({ id, badge: 'NEW BADGE', title: 'New Banner', highlight: 'Title', sub: 'SUPPORTING COPY', cta: 'Learn More' });
    },
    removeBanner(id: number) {
      const i = this.banners.findIndex((b) => b.id === id);
      if (i >= 0) this.banners.splice(i, 1);
    },
    moveBanner(from: number, to: number) {
      if (to < 0 || to >= this.banners.length || !this.banners[from]) return;
      const [b] = this.banners.splice(from, 1);
      this.banners.splice(to, 0, b!);
    },
    /** 促銷卡:欄位/圖片就地更新 */
    patchPromo(id: string, patch: Partial<PromoCard>) {
      const p = this.promoCards.find((x) => x.id === id);
      if (p) Object.assign(p, patch);
    },
    /** Mini/Slot/Live 分類遊戲管理 */
    addCatalogGame(catKey: string, g: CatalogGame) {
      this.miniCategories.find((c) => c.key === catKey)?.games.push({ ...g });
    },
    updateCatalogGame(catKey: string, index: number, patch: Partial<CatalogGame>) {
      const g = this.miniCategories.find((c) => c.key === catKey)?.games[index];
      if (g) Object.assign(g, patch);
    },
    removeCatalogGame(catKey: string, index: number) {
      this.miniCategories.find((c) => c.key === catKey)?.games.splice(index, 1);
    },
    moveCatalogGame(catKey: string, from: number, to: number) {
      const games = this.miniCategories.find((c) => c.key === catKey)?.games;
      if (!games || to < 0 || to >= games.length || !games[from]) return;
      const [g] = games.splice(from, 1);
      games.splice(to, 0, g!);
    },
    /** 遊戲管理(R6 追加 2026-07-16:上架/編輯含換圖/下架/排序) */
    addGame(g: HotGame) {
      this.hotGames.push({ ...g });
    },
    updateGame(index: number, patch: Partial<HotGame>) {
      const g = this.hotGames[index];
      if (g) Object.assign(g, patch);
    },
    removeGame(index: number) {
      this.hotGames.splice(index, 1);
    },
    moveGame(from: number, to: number) {
      if (to < 0 || to >= this.hotGames.length || !this.hotGames[from]) return;
      const [g] = this.hotGames.splice(from, 1);
      this.hotGames.splice(to, 0, g!);
    },
    /** 占位:正式環境接 API 寫回 */
    save() {
      this.savedAt = new Date().toLocaleTimeString();
    },
  },
});
