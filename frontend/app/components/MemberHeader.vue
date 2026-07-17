<script setup lang="ts">
import { computed, ref } from 'vue';

const { t } = useLocale();
const menuOpen = ref(false);
const nickname = useState<string>('member:nickname', () => 'meqomcao');
const links = computed(() => [
  { label: t('nav.home'), to: '/', icon: 'house' },
  { label: t('nav.hotGames'), to: '/hot-games', icon: 'flame' },
  { label: t('nav.sports'), to: '/sport', icon: 'trophy' },
  { label: t('nav.live'), to: '/live', icon: 'video' },
  { label: t('nav.slots'), to: '/slot', icon: 'cherry' },
  { label: t('nav.fish'), to: '/fish', icon: 'fish' },
  { label: t('nav.miniGames'), to: '/mini-games', icon: 'gamepad2' },
  { label: t('nav.promotion'), to: '/promotion', icon: 'gift' },
]);
const route = useRoute();
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to));
</script>

<template>
  <header class="bg-surface border-b border-line-soft sticky top-0 z-50">
    <div class="px-4">
      <div class="flex items-center h-16">
        <NuxtLink class="flex items-center gap-3 text-ink-2 hover:text-ink transition-colors" to="/">
          <img :src="withBase('/logo.png')" alt="Casino Logo" class="h-10 mix-blend-lighten">
        </NuxtLink>
        <div class="md:hidden ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <button class="text-ink-2 hover:text-ink" aria-label="Menu" @click="menuOpen = true">
            <AppIcon name="menu" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="menuOpen" class="fixed inset-0 z-[10001]" style="background:rgba(0,0,0,.6)" @click.self="menuOpen = false">
        <div class="absolute inset-0 flex flex-col overflow-hidden bg-surface pb-16">
          <div class="flex justify-between items-center h-[76px] min-[400px]:h-[92px] px-6 border-b border-line-soft flex-shrink-0">
            <img :src="withBase('/logo.png')" alt="Casino Logo" class="h-12 mix-blend-lighten">
            <button class="text-ink-2 hover:text-ink" aria-label="Close menu" @click="menuOpen = false">
              <AppIcon name="x" class="w-7 h-7" />
            </button>
          </div>
          <nav class="grid flex-1 min-h-0 py-2" :style="{ gridTemplateRows: `repeat(${links.length}, minmax(0, 1fr))` }">
            <NuxtLink
              v-for="m in links" :key="m.to" :to="m.to"
              class="mx-6 min-h-0 flex items-center gap-4 rounded-xl px-6 text-[17px] min-[400px]:text-[20px] font-semibold transition-colors"
              :class="isActive(m.to) ? 'bg-g-primary text-on-primary' : 'text-ink-2 hover:text-ink'"
              style="text-decoration:none"
              @click="menuOpen = false"
            >
              <AppIcon :name="m.icon" class="w-6 h-6 flex-shrink-0" />
              <span>{{ m.label }}</span>
            </NuxtLink>
          </nav>
          <div class="mx-6 py-3 border-t border-line flex-shrink-0">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 min-[400px]:w-14 min-[400px]:h-14 rounded-full bg-g-primary text-on-primary flex items-center justify-center flex-shrink-0">
                <AppIcon name="user" class="w-7 h-7" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-3">
                  <span class="text-ink text-lg min-[400px]:text-xl font-bold truncate">{{ nickname }}</span>
                  <span class="bg-g-primary text-on-primary text-xs min-[400px]:text-sm font-bold px-2.5 py-1 rounded-full leading-none">VIP1</span>
                </div>
                <div class="mt-1 text-sm min-[400px]:text-base font-semibold whitespace-nowrap">
                  <span class="text-ink-3">{{ t('account.balance') }}: </span>
                  <span class="text-primary">₩1,000,000,000</span>
                </div>
                <div class="text-sm min-[400px]:text-base font-semibold">
                  <span class="text-ink-3">{{ t('account.points') }}: </span>
                  <span class="text-primary">0.00</span>
                </div>
              </div>
            </div>
            <NuxtLink
              to="/account"
              class="mt-3 block text-center rounded-lg bg-g-primary text-on-primary text-sm font-bold"
              style="padding:10px 18px;text-decoration:none"
              @click="menuOpen = false"
            >{{ t('account.view') }}</NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
