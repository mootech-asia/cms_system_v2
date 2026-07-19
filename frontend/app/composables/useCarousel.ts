import { onMounted, onUnmounted, ref, watch } from 'vue';

/**
 * Banner 輪播共用邏輯(收斂自 AppBanner/AppBannerV2/AppBannerV3 三份幾乎逐字重複的
 * stop/next/prev/restart + watch banners.length 實作,行為不變):
 * - lengthGetter:目前 slides 數量(reactive getter,對應原本各檔的 banners.value.length)
 * - intervalMs:自動播放間隔(各檔各自傳入原本的數值,6000/5000)
 * next/prev 只移動 index,不自動重啟計時(比照原本寫法,由呼叫端在箭頭/觸控/
 * 分頁點擊後自行呼叫 restart());watch length 超出範圍時重置 index 並重啟。
 */
export function useCarousel(lengthGetter: () => number, intervalMs: number) {
  const index = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  const next = () => {
    if (lengthGetter()) index.value = (index.value + 1) % lengthGetter();
  };
  const prev = () => {
    if (lengthGetter()) index.value = (index.value - 1 + lengthGetter()) % lengthGetter();
  };
  const restart = () => {
    stop();
    if (lengthGetter() > 1) timer = setInterval(next, intervalMs);
  };

  watch(lengthGetter, (length) => {
    if (index.value >= length) index.value = 0;
    restart();
  });

  onMounted(restart);
  onUnmounted(stop);

  return { index, next, prev, stop, restart };
}
