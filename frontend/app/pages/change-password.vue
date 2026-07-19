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
        <h1 class="text-ink text-2xl md:text-3xl mb-6 md:mb-8">{{ isTxn ? 'Change Transaction Password' : 'Change Login Password' }}</h1>
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

