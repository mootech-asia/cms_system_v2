<script setup lang="ts">
definePageMeta({ layout: 'member' });
import { ref } from 'vue';
const root = ref<HTMLElement | null>(null);
useMemberPage(root);
</script>

<template>
  <div ref="root" class="flex flex-col">
    <h1 class="text-white text-3xl mb-8 w-full">Withdrawal Record</h1>
    <div class="w-full mb-4 flex md:hidden flex-col gap-2">
    <div style="display: flex; flex-wrap: nowrap; gap: 8px; align-items: center; width: 100%;">
    <div class="relative" style="flex-shrink: 0;">
    <button class="bg-[#1a2128] border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm whitespace-nowrap">Status: All</button>
    </div>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="" style="flex: 1 1 0%; min-width: 0px;">
    <span class="text-gray-400" style="flex-shrink: 0;">~</span>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="" style="flex: 1 1 0%; min-width: 0px;">
    </div>
    <div class="flex items-center justify-between">
    <button class="rec-confirm">Confirm</button>
    <AutoRefreshTimer />
    </div>
    </div>
    <div class="w-full mb-4 hidden md:flex flex-wrap gap-2 items-center justify-between">
    <div class="flex flex-wrap gap-2 items-center">
    <div class="relative" style="flex-shrink: 0;">
    <button class="bg-[#1a2128] border border-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm whitespace-nowrap">Status: All</button>
    </div>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="">
    <span class="text-gray-400">~</span>
    <input type="date" class="bg-[#1a2128] border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm" value="">
    <button class="rec-confirm">Confirm</button>
    </div>
    <AutoRefreshTimer />
    </div>
    <div class="w-full rounded-xl border border-gray-800 overflow-hidden">
    <div class="overflow-x-auto">
    <table class="rec-table"><thead><tr><th>Transaction No.</th><th>Request Time</th><th class="num">Paid Amount</th><th class="ctr">Status</th><th class="num">Request Amount</th><th>Bank Name</th><th>Paid Date</th><th>Remark</th></tr></thead><tbody><tr><td class="rec-mono">WD25081201</td><td class="rec-dim">2025-08-12 10:20</td><td class="num">80,000</td><td class="ctr"><span class="rec-pill ok">Approved</span></td><td class="num">80,000</td><td>KB Bank</td><td class="rec-dim">2025-08-12 10:45</td><td>-</td></tr><tr><td class="rec-mono">WD25081104</td><td class="rec-dim">2025-08-11 16:50</td><td class="num">150,000</td><td class="ctr"><span class="rec-pill ok">Approved</span></td><td class="num">150,000</td><td>Shinhan</td><td class="rec-dim">2025-08-11 17:10</td><td>-</td></tr><tr><td class="rec-mono">WD25081006</td><td class="rec-dim">2025-08-10 11:05</td><td class="num">40,000</td><td class="ctr"><span class="rec-pill warn">Pending</span></td><td class="num">40,000</td><td>Woori</td><td class="rec-dim">-</td><td>-</td></tr><tr><td class="rec-mono">WD25080903</td><td class="rec-dim">2025-08-09 22:14</td><td class="num">25,000</td><td class="ctr"><span class="rec-pill bad">Rejected</span></td><td class="num">25,000</td><td>KB Bank</td><td class="rec-dim">-</td><td>Rollover left</td></tr></tbody></table>
    </div>
    </div>
    <div class="total-bar" style="position: fixed; right: 0px; z-index: 100; background: rgb(13, 27, 42); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(245, 158, 11, 0.3);">
    <span style="color: rgb(245, 158, 11); font-weight: 600;">Total Withdrawal Amount</span>
    <span style="color: rgb(245, 158, 11); font-weight: 600;">270,000</span>
    </div>
  </div>
</template>
