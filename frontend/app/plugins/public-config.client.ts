import { PUBLIC_CONFIG_KEY, applyPublicConfig, readPublicConfig } from '~/utils/public-config';

/**
 * 讀 localStorage 的 win100-public-config 套進 site store,
 * 讓 /studio「套用到本站」與 /admin 皮膚分頁的設定在前台生效
 * (SSG 預渲染 / store 初始值仍用模板預設,避免 hydration mismatch;
 * onNuxtReady 確保 hydration 完成後才套用)。掛 storage 事件做跨分頁同步。
 */
export default defineNuxtPlugin(() => {
  const siteStore = useSiteStore();

  const apply = () => {
    const config = readPublicConfig();
    if (config) applyPublicConfig(siteStore, config);
  };

  onNuxtReady(() => {
    apply();
    window.addEventListener('storage', (event) => {
      if (event.key === PUBLIC_CONFIG_KEY) apply();
    });
  });
});
