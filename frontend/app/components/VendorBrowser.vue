<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ title: string; kind: string }>();

const SLOT_VENDORS = [
  'Pragmatic Play', 'PG Soft', 'CQ9 Gaming', 'Hacksaw Gaming', 'NetEnt', 'Nolimit City',
  'Big Time Gaming', 'Booongo', 'JILI', 'PlayStar', 'Yggdrasil', 'Evoplay',
  'Skywind', 'Spadegaming', "Play'n GO", 'Microgaming', 'Habanero', 'Playtech',
  'Red Tiger', 'Relax Gaming', 'Push Gaming', 'Wazdan', 'Blueprint', 'Quickspin',
  'Thunderkick', 'ELK Studios', 'Playson', 'Kalamba', 'Fantasma', 'Dragoon Soft',
];
const LIVE_VENDORS = [
  'Evolution Gaming', 'Pragmatic Play Live', 'Sexy Gaming', 'Yeebet Live', 'WM Casino', 'Dream Gaming',
  'SA Gaming', 'Ezugi', 'Playtech Live', 'BG Big Gaming', 'Allbet', 'Asia Gaming',
  'eBET', 'VIVO Gaming', 'Microgaming Live', 'AE Sexy', 'OG Casino', 'Green Dragon',
  'N2 Live', 'Ho Gaming', 'Bet Games', 'Skywind Live', 'CQ9 Live', 'PP Live Deluxe',
  'Royal Gaming', 'Lucky Streak', 'Betradar Live', 'Xpro Gaming', 'Winfinity', 'Atmosfera',
];
const PHOTOS = [
  'photo-1604028297236-42130c7dcc3a__w-400', 'photo-1604028296525-8304e1a4969f__w-400',
  'photo-1534620780923-1ce0db377c3f__w-400', 'photo-1590336225155-d7e19a3a954f__w-400',
  'photo-1771775606196-70dccc0d9bde__w-400', 'photo-1525018667593-176858caed6a__w-400',
];
const photo = (i: number) => `/_external/images.unsplash.com/${PHOTOS[((i % PHOTOS.length) + PHOTOS.length) % PHOTOS.length]}`;

const vendors = computed(() => (props.kind === 'live' ? LIVE_VENDORS : SLOT_VENDORS));
const tab = ref<'vendor' | 'favorites'>('vendor');
const active = ref<string | null>(null);
const q = ref('');
const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  return vendors.value.filter((v) => !s || v.toLowerCase().includes(s));
});

const router = useRouter();
function back() {
  if (active.value) { active.value = null; return; }
  router.back();
}
function openVendor(v: string) {
  active.value = v;
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' });
}
function selectTab(t: 'vendor' | 'favorites') { tab.value = t; active.value = null; }

// 收藏(元件生命週期內記憶)
const favs = ref<Set<string>>(new Set());
const favId = (vendor: string, i: number) => `${vendor}||${i}`;
const isFav = (vendor: string, i: number) => favs.value.has(favId(vendor, i));
function toggleFav(vendor: string, i: number) {
  const id = favId(vendor, i);
  const s = new Set(favs.value);
  if (s.has(id)) s.delete(id); else s.add(id);
  favs.value = s;
}
const favGames = computed(() => [...favs.value].map((id) => {
  const idx = id.lastIndexOf('||');
  return { vendor: id.slice(0, idx), i: Number(id.slice(idx + 2)) };
}));
const gameList = computed(() => (tab.value === 'favorites'
  ? favGames.value
  : (active.value ? Array.from({ length: 24 }, (_, i) => ({ vendor: active.value as string, i })) : [])));
</script>

<template>
  <section class="py-8 bg-[#0f1419] min-h-[400px]">
    <div class="container mx-auto px-4">
      <div id="inner-back">
        <button type="button" @click="back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          <span>Back</span>
        </button>
      </div>

      <div class="vnd-tabs">
        <button :class="{ active: tab === 'vendor' }" @click="selectTab('vendor')">Vendor</button>
        <button :class="{ active: tab === 'favorites' }" @click="selectTab('favorites')">Favorites</button>
      </div>

      <div class="vnd-head">
        <h2>{{ title }}</h2>
        <div class="vnd-search">
          <svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input v-model="q" type="text" placeholder="Vendor Name">
          <button class="s-btn" type="button">Search</button>
        </div>
      </div>

      <div v-if="tab === 'favorites' && !favGames.length" class="vnd-empty">No favorites yet - tap the star on a game to add one.</div>

      <div v-else-if="tab === 'vendor' && !active" class="vnd-grid">
        <button v-for="(v, i) in filtered" :key="v" class="vnd-card" @click="openVendor(v)">
          <span class="vnd-bg" :style="{ backgroundImage: `url(${photo(i)})` }"></span>
          <span class="vnd-shade"></span>
          <svg class="vnd-arc" viewBox="0 0 400 200" preserveAspectRatio="none" fill="none"><path d="M-20,210 C120,120 300,150 430,-10" stroke="rgba(152,231,210,.35)" stroke-width="1.5" /><path d="M-20,240 C140,150 320,180 440,20" stroke="rgba(152,231,210,.16)" stroke-width="1.5" /></svg>
          <span class="vnd-name">{{ v }}</span>
        </button>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="g in gameList" :key="`${g.vendor}-${g.i}`"
          class="bg-[#1a2128] border border-gray-800 rounded-lg overflow-hidden hover:border-[#98E7D2] transition-colors cursor-pointer group"
        >
          <div class="aspect-[4/3] relative overflow-hidden">
            <img :src="photo(g.i)" alt="Game Name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300">
            <button
              class="absolute top-2 right-2 z-10 focus:outline-none bg-black/50 rounded-full p-1.5 transition-colors"
              aria-label="Favourite" @click.stop="toggleFav(g.vendor, g.i)"
            >
              <svg
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                :fill="isFav(g.vendor, g.i) ? '#98E7D2' : 'none'"
                :style="{ width: '14px', height: '14px', color: isFav(g.vendor, g.i) ? '#98E7D2' : '#fff' }"
              ><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
            </button>
          </div>
          <div class="p-4">
            <h3 class="text-white mb-1 truncate">Game Name</h3>
            <p class="text-gray-400 text-sm mb-3 truncate">{{ g.vendor }}</p>
            <button class="w-full bg-gradient-to-r from-[#CBE8E4] to-[#98E7D2] text-gray-900 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">Play Now</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#inner-back{padding:0 0 18px}
#inner-back button{display:inline-flex;align-items:center;gap:6px;background:none;border:0;color:#fff;font-size:22px;font-weight:700;cursor:pointer;padding:0}
#inner-back button:hover{color:#98E7D2}
#inner-back svg{width:24px;height:24px}
.vnd-tabs{display:flex;gap:32px;border-bottom:1px solid #263241;margin-bottom:26px}
.vnd-tabs button{position:relative;padding:0 0 14px;background:none;border:0;color:#9ca3af;font-weight:600;font-size:15px;cursor:pointer}
.vnd-tabs button.active{color:#98E7D2}
.vnd-tabs button.active::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:linear-gradient(90deg,#CBE8E4,#98E7D2)}
.vnd-head{display:flex;flex-direction:column;gap:16px;margin-bottom:26px}
@media(min-width:768px){.vnd-head{flex-direction:row;align-items:center;justify-content:space-between}}
.vnd-head h2{color:#fff;font-size:26px;font-weight:600;margin:0}
.vnd-search{position:relative;display:flex;gap:10px}
.vnd-search input{background:#1a2128;border:1px solid #374151;border-radius:10px;padding:11px 14px 11px 38px;color:#fff;outline:none;min-width:220px}
.vnd-search input:focus{border-color:#98E7D2}
.vnd-search .s-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#9ca3af;width:16px;height:16px}
.vnd-search .s-btn{background:linear-gradient(90deg,#CBE8E4,#98E7D2);color:#0f1622;border:0;border-radius:10px;padding:0 20px;font-weight:700;cursor:pointer;white-space:nowrap}
.vnd-empty{text-align:center;color:#9ca3af;padding:56px 16px}
.vnd-grid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:16px}
@media(min-width:640px){.vnd-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1024px){.vnd-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
.vnd-card{position:relative;display:block;height:140px;border-radius:16px;border:1px solid rgba(152,231,210,.4);overflow:hidden;cursor:pointer;transition:border-color .18s ease,transform .18s ease,box-shadow .18s ease;text-align:left}
.vnd-card:hover{border-color:#98E7D2;transform:translateY(-3px);box-shadow:0 0 0 1px rgba(152,231,210,.5),0 14px 32px rgba(0,0,0,.5)}
.vnd-card .vnd-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .35s ease}
.vnd-card:hover .vnd-bg{transform:scale(1.06)}
.vnd-card .vnd-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(9,14,20,.94) 0%,rgba(9,14,20,.78) 38%,rgba(9,14,20,.28) 72%,rgba(9,14,20,.1) 100%)}
.vnd-card .vnd-arc{position:absolute;right:0;bottom:0;width:75%;height:100%;pointer-events:none;opacity:.7}
.vnd-card .vnd-name{position:absolute;left:26px;top:50%;transform:translateY(-50%);z-index:1;max-width:62%;color:#fff;font-size:22px;font-weight:800;line-height:1.2;letter-spacing:.01em;text-shadow:0 2px 14px rgba(0,0,0,.75)}
</style>
