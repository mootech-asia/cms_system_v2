<script setup lang="ts">
definePageMeta({ layout: 'member' });
import { ref } from 'vue';
const root = ref<HTMLElement | null>(null);
useMemberPage(root);
</script>

<template>
  <div ref="root" class="flex flex-col">
    <h1 class="text-white text-3xl mb-8 w-full">Account Record</h1>
    <div class="w-full mb-4 flex md:hidden flex-col gap-2">
    <div style="display: flex; flex-wrap: nowrap; gap: 8px; align-items: center; width: 100%;">
    <div class="relative" style="flex-shrink: 0;">
    <button class="bg-[#1a2128] border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm whitespace-nowrap">Status: All</button>
    </div>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="" style="flex: 1 1 0%; min-width: 0px;">
    <span class="text-gray-400" style="flex-shrink: 0;">~</span>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="" style="flex: 1 1 0%; min-width: 0px;">
    </div>
    <button class="rec-confirm" style="align-self: flex-start;">Confirm</button>
    </div>
    <div class="w-full mb-4 hidden md:flex flex-wrap gap-2 items-center">
    <div class="relative" style="flex-shrink: 0;">
    <button class="bg-[#1a2128] border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm whitespace-nowrap">Status: All</button>
    </div>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="">
    <span class="text-gray-400">~</span>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="">
    <button class="rec-confirm">Confirm</button>
    </div>
    <div class="w-full rounded-xl border border-gray-800 overflow-hidden">
    <div class="overflow-x-auto">
    <table class="rec-table"><thead><tr><th>Transaction Type</th><th>Time</th><th class="num">Transaction Amount</th><th class="num">Current Balance</th><th>Transaction No.</th><th>Content</th></tr></thead><tbody><tr><td class="rec-strong">Deposit</td><td class="rec-dim">2025-08-12 09:18</td><td class="num rec-pos">+100,000</td><td class="num">1,284,320</td><td class="rec-mono">DP25081201</td><td>Bank deposit approved</td></tr><tr><td class="rec-strong">Bet</td><td class="rec-dim">2025-08-12 15:48</td><td class="num rec-neg">-50,000</td><td class="num">1,234,320</td><td class="rec-mono">BT25081201</td><td>Sports — Champions League</td></tr><tr><td class="rec-strong">Win</td><td class="rec-dim">2025-08-12 15:52</td><td class="num rec-pos">+92,500</td><td class="num">1,326,820</td><td class="rec-mono">WN25081201</td><td>Sports settlement</td></tr><tr><td class="rec-strong">Withdrawal</td><td class="rec-dim">2025-08-12 10:45</td><td class="num rec-neg">-80,000</td><td class="num">1,246,820</td><td class="rec-mono">WD25081201</td><td>Bank withdrawal paid</td></tr></tbody></table>
    </div>
    </div>
  </div>
</template>
