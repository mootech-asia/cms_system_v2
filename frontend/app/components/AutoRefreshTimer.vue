<script setup lang="ts">
// 紀錄頁的自動更新倒數(與靜態版 js/records.js 一致:30 秒循環,↺ 立即重置)
import { onBeforeUnmount, onMounted, ref } from 'vue';

const INTERVAL = 30;
const left = ref(INTERVAL);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    // 歸零即重置;實站接 API 後在歸零時重新取數
    left.value = left.value > 0 ? left.value - 1 : INTERVAL;
  }, 1000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
function reset() {
  left.value = INTERVAL;
}
</script>

<template>
  <div class="flex items-center gap-1 text-gray-400 text-sm" style="white-space: nowrap;">
    <span>Auto refresh in {{ left }} s</span>
    <span class="cursor-pointer ml-1" style="color:#98E7D2" role="button" aria-label="Refresh now" @click="reset">↺</span>
  </div>
</template>
