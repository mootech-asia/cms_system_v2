<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  type?: 'success' | 'warning' | 'confirm' | 'danger';
  title?: string;
  message?: string;
  subject?: string;
  confirmText?: string;
  cancelText?: string;
}>();
defineEmits<{ confirm: []; cancel: [] }>();

const type = computed(() => props.type || 'success');
const title = computed(() => props.title || (
  type.value === 'warning'
    ? 'Warning'
    : type.value === 'confirm'
      ? 'Confirmation'
      : type.value === 'danger'
        ? 'Delete Account?'
        : 'Success!'
));
const message = computed(() => (
  props.message != null
    ? props.message
    : type.value === 'success'
      ? 'Profile updated successfully.'
      : ''
));
const confirmText = computed(() => props.confirmText || (
  type.value === 'confirm'
    ? 'Yes'
    : type.value === 'danger'
      ? 'Delete'
      : 'Got It'
));
</script>

<template>
  <div class="mf-overlay" @click.self="$emit('cancel')">
    <div class="mf-modal" :class="{ 'mf-modal-danger': type === 'danger' }" role="dialog" aria-modal="true">
      <div class="mf-modal-icon">
        <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        <svg v-else-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        <svg v-else-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 15H6L5 6" /><path d="M10 11v5M14 11v5" /></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
      </div>
      <h3 class="mf-modal-title">{{ title }}</h3>
      <p v-if="type === 'danger'" class="mf-modal-msg mf-modal-danger-msg">
        Are you sure you want to remove <strong>{{ subject || 'this bank account' }}</strong>?<br>
        This action cannot be undone.
      </p>
      <p v-else-if="message" class="mf-modal-msg">{{ message }}</p>

      <div v-if="type === 'danger'" class="mf-modal-actions">
        <button type="button" class="mf-modal-btn danger-cancel" @click="$emit('cancel')">{{ cancelText || 'Cancel' }}</button>
        <button type="button" class="mf-modal-btn danger-confirm" @click="$emit('confirm')">{{ confirmText }}</button>
      </div>
      <template v-else>
        <button type="button" class="mf-modal-btn" @click="$emit('confirm')">{{ confirmText }}</button>
        <button v-if="type === 'confirm'" type="button" class="mf-modal-btn secondary" @click="$emit('cancel')">{{ cancelText || 'No' }}</button>
      </template>
    </div>
  </div>
</template>
