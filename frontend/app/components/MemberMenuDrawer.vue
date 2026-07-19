<script setup lang="ts">
// 底部導覽「Browse」開啟的會員選單左抽屜(對齊靜態版 js/mobile.js openMemberMenu)
const open = useState<boolean>('ui:memberMenuOpen', () => false);
const route = useRoute();

const links = [
  { label: 'Account Overview', to: '/account', icon: 'grid' },
  { label: 'Deposit', to: '/deposit', icon: 'download' },
  { label: 'Withdrawal', to: '/withdrawal', icon: 'upload' },
  { label: 'Betting Record', to: '/betting-record', icon: 'history' },
  { label: 'Deposit Record', to: '/deposit-record', icon: 'file' },
  { label: 'Profit And Loss', to: '/profit-loss', icon: 'trend' },
  { label: 'Withdrawal Record', to: '/withdrawal-record', icon: 'file' },
  { label: 'Account Record', to: '/account-record', icon: 'file' },
  { label: 'Personal Info', to: '/personal-info', icon: 'user' },
  { label: 'Security Center', to: '/security', icon: 'shield' },
  { label: 'Customer Service', to: '/support', icon: 'chat' },
] as const;

const PARENT: Record<string, string> = { '/change-nickname': '/account' };
const isActive = (to: string) => (PARENT[route.path] || route.path) === to;
</script>

<template>
  <Teleport to="body">
    <Transition name="mmd">
      <div v-if="open" class="mmd-overlay" @click.self="open = false">
        <div class="mmd-panel">
          <div class="mmd-head">
            <span>Menu</span>
            <button type="button" aria-label="Close menu" @click="open = false">
              <AppIcon name="x" class="w-6 h-6" />
            </button>
          </div>
          <nav class="mmd-links" :style="{ gridTemplateRows: `repeat(${links.length}, minmax(0, 1fr))` }">
            <NuxtLink
              v-for="l in links" :key="l.to" :to="l.to"
              class="mmd-row" :class="{ active: isActive(l.to) }"
              @click="open = false"
            >
              <AppIcon :name="l.icon" class="mmd-icon" />
              <span>{{ l.label }}</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
