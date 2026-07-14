<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div id="inner-back">
    <button type="button" @click="router.back()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      <span>Back</span>
    </button>
  </div>
</template>

<style scoped>
#inner-back{align-self:flex-start;width:100%;padding:0 0 18px}
#inner-back button{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:8px;border:1px solid rgba(152,231,210,.24);background:#1a2128;color:#f9fafb;font-size:15px;font-weight:800;line-height:1;cursor:pointer;transition:background .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease}
#inner-back button:hover,#inner-back button:focus-visible{background:linear-gradient(90deg,#CBE8E4,#98E7D2);border-color:transparent;color:#0f1419;transform:translateY(-1px);box-shadow:0 8px 20px rgba(152,231,210,.18);outline:none}
#inner-back svg{width:18px;height:18px;stroke-width:2.8}
</style>
