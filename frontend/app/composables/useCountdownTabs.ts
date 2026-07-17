import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface CountdownTabOptions {
  keys: { readonly value: string[] };
  initial?: string;
  intervalMs?: number;
  onAdvance?: (key: string) => void | Promise<void>;
}

export function useCountdownTabs(options: CountdownTabOptions) {
  const intervalMs = options.intervalMs ?? 8000;
  const active = ref(options.initial || options.keys.value[0] || '');
  const remainingMs = ref(intervalMs);
  let timer: ReturnType<typeof setInterval> | null = null;

  const activeIndex = computed(() => Math.max(0, options.keys.value.indexOf(active.value)));
  const remainingSeconds = computed(() => Math.max(1, Math.ceil(remainingMs.value / 1000)));
  const progress = computed(() => Math.max(0, Math.min(100, (remainingMs.value / intervalMs) * 100)));

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const restart = () => {
    remainingMs.value = intervalMs;
  };

  const setActive = (key: string, reset = true) => {
    if (!options.keys.value.includes(key)) return;
    active.value = key;
    if (reset) restart();
  };

  const advance = () => {
    const keys = options.keys.value;
    if (!keys.length) return;
    const nextKey = keys[(activeIndex.value + 1) % keys.length]!;
    active.value = nextKey;
    remainingMs.value = intervalMs;
    options.onAdvance?.(nextKey);
  };

  const start = () => {
    stop();
    timer = setInterval(() => {
      remainingMs.value -= 250;
      if (remainingMs.value <= 0) advance();
    }, 250);
  };

  watch(() => options.keys.value, (keys) => {
    if (!keys.includes(active.value)) active.value = keys[0] || '';
    restart();
  }, { deep: true });

  onMounted(start);
  onBeforeUnmount(stop);

  return {
    active,
    remainingSeconds,
    progress,
    restart,
    setActive,
    advance,
  };
}
