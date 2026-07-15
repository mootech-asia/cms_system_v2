<script setup lang="ts">
definePageMeta({ layout: 'member' });
import { ref } from 'vue';
const root = ref<HTMLElement | null>(null);
useMemberPage(root);
</script>

<template>
  <div ref="root" class="flex flex-col">
    <h1 class="text-white text-3xl font-bold mb-8 w-full">Betting Record</h1>
    <div class="w-full mb-6 flex md:hidden flex-col gap-2">
    <div class="w-full flex gap-3 items-center">
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-[#98E7D2] transition-colors" value="" style="flex: 1 1 0%; min-width: 0px;">
    <span class="text-gray-500 fw-400" style="flex-shrink: 0;">—</span>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-[#98E7D2] transition-colors" value="" style="flex: 1 1 0%; min-width: 0px;">
    </div>
    <button class="rec-confirm" style="align-self: flex-start;">Confirm</button>
    </div>
    <div class="w-full mb-6 hidden md:flex flex-wrap gap-3 items-center">
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-[#98E7D2] transition-colors" value="">
    <span class="text-gray-500 fw-400">—</span>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 text-sm focus:outline-none focus:border-[#98E7D2] transition-colors" value="">
    <button class="rec-confirm">Confirm</button>
    </div>
    <div class="w-full rounded-xl border border-gray-800 overflow-hidden">
    <div class="overflow-x-auto">
    <table class="rec-table"><thead><tr><th>Order No</th><th>Game</th><th>Settlement Time</th><th class="num">Bet Amount</th><th class="num">Valid Bet</th><th class="num">Winnings</th><th class="num">Bet P&amp;L</th></tr></thead><tbody><tr><td class="rec-mono">202508120001</td><td class="rec-strong">Sports</td><td class="rec-dim">2025-08-12 15:48</td><td class="num">50,000</td><td class="num">50,000</td><td class="num">92,500</td><td class="num rec-pos">+42,500</td></tr><tr><td class="rec-mono">202508120002</td><td class="rec-strong">Slots</td><td class="rec-dim">2025-08-12 14:30</td><td class="num">20,000</td><td class="num">20,000</td><td class="num">0</td><td class="num rec-neg">-20,000</td></tr><tr><td class="rec-mono">202508110007</td><td class="rec-strong">Live Casino</td><td class="rec-dim">2025-08-11 18:20</td><td class="num">35,000</td><td class="num">35,000</td><td class="num">78,000</td><td class="num rec-pos">+43,000</td></tr><tr><td class="rec-mono">202508110003</td><td class="rec-strong">Sports</td><td class="rec-dim">2025-08-11 12:15</td><td class="num">10,000</td><td class="num">10,000</td><td class="num">8,500</td><td class="num rec-neg">-1,500</td></tr></tbody></table>
    </div>
    </div>
  </div>
</template>
