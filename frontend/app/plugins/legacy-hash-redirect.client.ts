/**
 * 舊版 GitHub Pages 使用 hash router(#/slot、#/live?...);
 * 正式切換到 Nuxt history router 後保留這些既有書籤與外部連結。
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const legacyRoute = window.location.hash;
    if (!legacyRoute.startsWith('#/')) return;

    void navigateTo(legacyRoute.slice(1), { replace: true });
  });
});
