<script setup lang="ts">
definePageMeta({ layout: 'member' });
import { ref } from 'vue';
const root = ref<HTMLElement | null>(null);
useMemberPage(root);
</script>

<template>
  <div ref="root" class="flex flex-col">
    <h1 class="text-white text-3xl mb-8 w-full">Customer Service</h1>
    <div class="bg-[#1a2128] border border-gray-800 rounded-lg p-8 text-center w-full">
    <p class="text-gray-400">Coming Soon</p>
    </div>
  </div>
</template>
