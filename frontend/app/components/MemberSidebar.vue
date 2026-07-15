<script setup lang="ts">
const props = defineProps<{ active?: string }>();
const route = useRoute();
/* 子頁歸屬:安全中心的兩個子頁在側欄上仍高亮 Security Center */
const PARENT: Record<string, string> = {
  '/change-password': '/security',
  '/banking-details': '/security',
};
const current = computed(() => props.active || PARENT[route.path] || route.path);
const links = [
  ['Account Overview', '/account', 'grid'],
  ['Deposit', '/deposit', 'download'],
  ['Withdrawal', '/withdrawal', 'upload'],
  ['Betting Record', '/betting-record', 'history'],
  ['Deposit Record', '/deposit-record', 'file'],
  ['Profit And Loss', '/profit-loss', 'trend'],
  ['Withdrawal Record', '/withdrawal-record', 'file'],
  ['Account Record', '/account-record', 'file'],
  ['Personal Info', '/personal-info', 'user'],
  ['Security Center', '/security', 'shield'],
] as const;
</script>

<template>
  <aside class="hidden md:block w-64 flex-shrink-0 bg-[#1a2128] border-r border-gray-800 sticky top-0 h-screen overflow-y-auto">
    <nav class="p-4 space-y-2">
      <NuxtLink
        v-for="[label, to, icon] in links"
        :key="to"
        :to="to"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
        :class="current === to
          ? 'bg-gradient-to-r from-[#CBE8E4] to-[#98E7D2] text-gray-900 font-semibold'
          : 'text-gray-300 hover:bg-[#0f1419] hover:text-white'"
      >
        <AppIcon :name="icon" class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm">{{ label }}</span>
      </NuxtLink>
      <button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#0f1419] hover:text-white">
        <AppIcon name="chat" class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm">Customer Service</span>
      </button>
    </nav>
  </aside>
</template>
