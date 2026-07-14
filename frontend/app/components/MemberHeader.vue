<script setup lang="ts">
import { ref } from 'vue';

const menuOpen = ref(false);
const langs = [
  { code: 'EN', label: 'English' },
  { code: '한국어', label: '한국어' },
];
const lang = useState<string>('ui:lang', () => 'EN');
const langOpen = ref(false);
const links = [
  { label: 'Home', to: '/', icon: 'house' },
  { label: 'Hot Games', to: '/hot-games', icon: 'flame' },
  { label: 'Sports', to: '/sport', icon: 'trophy' },
  { label: 'Live', to: '/live', icon: 'video' },
  { label: 'Slots', to: '/slot', icon: 'cherry' },
  { label: 'Fish', to: '/fish', icon: 'fish' },
  { label: 'Mini Games', to: '/mini-games', icon: 'gamepad2' },
  { label: 'Promotion', to: '/promotion', icon: 'gift' },
];
const route = useRoute();
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to));
</script>

<template>
  <header class="bg-[#1a2128] border-b border-gray-800 sticky top-0 z-50">
    <div class="px-4">
      <div class="flex items-center h-16">
        <NuxtLink class="flex items-center gap-3 text-gray-300 hover:text-white transition-colors" to="/">
          <img src="/logo.png" alt="Casino Logo" class="h-10 mix-blend-lighten">
        </NuxtLink>
        <div class="ml-auto flex items-center gap-3">
          <div class="relative">
            <button class="text-gray-300 hover:text-white flex items-center gap-1" @click="langOpen = !langOpen">
              <AppIcon name="globe" class="w-5 h-5" /><span>{{ lang }}</span><AppIcon name="chevron-down" class="w-3 h-3" />
            </button>
            <div v-if="langOpen" class="fixed inset-0 z-[999]" @click="langOpen = false"></div>
            <div
              v-if="langOpen"
              class="absolute right-0 top-full z-[1000]"
              style="margin-top:6px;background:#1a2128;border:1px solid #2a3441;border-radius:10px;padding:6px;min-width:140px;box-shadow:0 12px 30px rgba(0,0,0,.45)"
            >
              <div
                v-for="l in langs" :key="l.code"
                class="rounded-md cursor-pointer"
                style="padding:9px 14px;font-size:14px;white-space:nowrap"
                :style="{ color: lang === l.code ? '#98E7D2' : '#d1d5db', fontWeight: lang === l.code ? 700 : 400 }"
                @click="lang = l.code; langOpen = false"
              >{{ l.label }}</div>
            </div>
          </div>
          <button class="text-gray-300 hover:text-white" aria-label="Menu" @click="menuOpen = true">
            <AppIcon name="menu" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="menuOpen" class="fixed inset-0 z-[10001]" style="background:rgba(0,0,0,.6)" @click.self="menuOpen = false">
        <div class="absolute inset-0 flex flex-col overflow-hidden bg-[#1a2128] pb-16">
          <div class="flex justify-between items-center h-[76px] min-[400px]:h-[92px] px-6 border-b border-gray-800 flex-shrink-0">
            <img src="/logo.png" alt="Casino Logo" class="h-12 mix-blend-lighten">
            <button class="text-gray-300 hover:text-white" aria-label="Close menu" @click="menuOpen = false">
              <AppIcon name="x" class="w-7 h-7" />
            </button>
          </div>
          <nav class="grid flex-1 min-h-0 py-2" :style="{ gridTemplateRows: `repeat(${links.length}, minmax(0, 1fr))` }">
            <NuxtLink
              v-for="m in links" :key="m.to" :to="m.to"
              class="mx-6 min-h-0 flex items-center gap-4 rounded-xl px-6 text-[17px] min-[400px]:text-[20px] font-semibold transition-colors"
              :class="isActive(m.to) ? 'bg-gradient-to-r from-[#CBE8E4] to-[#98E7D2] text-gray-900' : 'text-gray-300 hover:text-white'"
              style="text-decoration:none"
              @click="menuOpen = false"
            >
              <AppIcon :name="m.icon" class="w-6 h-6 flex-shrink-0" />
              <span>{{ m.label }}</span>
            </NuxtLink>
          </nav>
          <div class="mx-6 py-3 border-t border-gray-700 flex-shrink-0">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 min-[400px]:w-14 min-[400px]:h-14 rounded-full bg-gradient-to-r from-[#CBE8E4] to-[#98E7D2] text-gray-900 flex items-center justify-center flex-shrink-0">
                <AppIcon name="user" class="w-7 h-7" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-3">
                  <span class="text-white text-lg min-[400px]:text-xl font-bold truncate">meqomcao</span>
                  <span class="bg-gradient-to-r from-[#CBE8E4] to-[#98E7D2] text-gray-900 text-xs min-[400px]:text-sm font-bold px-2.5 py-1 rounded-full leading-none">VIP1</span>
                </div>
                <div class="mt-1 text-sm min-[400px]:text-base font-semibold whitespace-nowrap">
                  <span class="text-gray-400">Balance: </span>
                  <span class="text-[#98E7D2]">₩1,000,000,000</span>
                </div>
                <div class="text-sm min-[400px]:text-base font-semibold">
                  <span class="text-gray-400">Points: </span>
                  <span class="text-[#98E7D2]">0.00</span>
                </div>
              </div>
            </div>
            <NuxtLink
              to="/account"
              class="mt-3 block text-center rounded-lg bg-gradient-to-r from-[#CBE8E4] to-[#98E7D2] text-gray-900 text-sm font-bold"
              style="padding:10px 18px;text-decoration:none"
              @click="menuOpen = false"
            >View Account</NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
