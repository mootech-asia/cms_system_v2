<script setup lang="ts">
definePageMeta({ layout: 'member' });
import { computed, ref } from 'vue';

const isTxn = useRoute().query.type === 'txn';
// 登入密碼只驗長度;交易密碼驗可見 ASCII(與靜態版 transaction-password.js 一致)
const VISIBLE_ASCII = /^[\x21-\x7E]{5,16}$/;
const HINT = isTxn
  ? '★Use 5-16 visible ASCII characters (letters, numbers, symbols)'
  : '★Length must be 5-16 characters.';
const newPw = ref('');
const confirmPw = ref('');
const showNew = ref(false);
const showConfirm = ref(false);
const ready = computed(() => newPw.value.trim() !== '' && confirmPw.value.trim() !== '');

type Modal = { type: 'success' | 'warning'; message?: string; onConfirm?: () => void } | null;
const modal = ref<Modal>(null);

function submit() {
  if (!ready.value) return;
  const a = newPw.value;
  if (isTxn && !VISIBLE_ASCII.test(a)) { modal.value = { type: 'warning', message: 'Use 5-16 visible ASCII characters (letters, numbers, symbols).' }; return; }
  if (!isTxn && (a.length < 5 || a.length > 16)) { modal.value = { type: 'warning', message: 'Length must be 5-16 characters.' }; return; }
  if (a !== confirmPw.value) { modal.value = { type: 'warning', message: 'The two passwords do not match.' }; return; }
  modal.value = { type: 'success', onConfirm: () => { newPw.value = ''; confirmPw.value = ''; } };
}
function closeModal() {
  const m = modal.value;
  modal.value = null;
  m?.onConfirm?.();
}
</script>

<template>
  <div>
        <h1 class="text-white text-2xl md:text-3xl mb-6 md:mb-8">{{ isTxn ? 'Change Transaction Password' : 'Change Login Password' }}</h1>
        <div class="mf-card">
          <div class="mf-field">
            <input class="mf-input" :type="showNew ? 'text' : 'password'" v-model="newPw" placeholder="Please enter a new password">
            <button type="button" class="mf-eye" @click="showNew = !showNew"><AppIcon name="eye" /></button>
          </div>
          <div class="mf-field">
            <input class="mf-input" :type="showConfirm ? 'text' : 'password'" v-model="confirmPw" placeholder="Confirm your password">
            <button type="button" class="mf-eye" @click="showConfirm = !showConfirm"><AppIcon name="eye" /></button>
          </div>
          <p class="mf-hint">{{ HINT }}</p>
          <button type="button" class="mf-submit" :class="{ ready }" :disabled="!ready" @click="submit"><span>Submit</span></button>
        </div>
    <MemberModal v-if="modal" :type="modal.type" :message="modal.message" @confirm="closeModal" @cancel="closeModal" />
  </div>
</template>

<style scoped>
.mf-card{background:#1a2128;border:1px solid #1f2937;border-radius:12px;padding:24px;max-width:56rem;margin:0 auto;width:100%;box-sizing:border-box}
.mf-field{position:relative;margin-bottom:16px}
.mf-input{box-sizing:border-box;width:100%;min-height:52px;background:#0f1419;border:1px solid #374151;border-radius:10px;padding:14px 46px 14px 16px;color:#fff;font-size:15px;outline:none}
.mf-input::placeholder{color:#6b7280}
.mf-input:focus{border-color:#98E7D2}
.mf-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:0;color:#9ca3af;cursor:pointer;padding:0;line-height:0}
.mf-eye:hover{color:#d1d5db}
.mf-eye :deep(svg){width:20px;height:20px}
.mf-hint{color:#fff;font-size:14px;margin:6px 0 24px}
.mf-submit{display:block;width:100%;padding:15px;border:0;border-radius:10px;background:#4b5563;font-weight:700;font-size:16px;cursor:not-allowed;text-align:center}
.mf-submit span{color:#d1d5db}
.mf-submit.ready{background:linear-gradient(90deg,#CBE8E4,#98E7D2);cursor:pointer}
.mf-submit.ready span{color:#0f1622;font-weight:800}
</style>
