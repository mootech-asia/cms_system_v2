<script setup lang="ts">
definePageMeta({ layout: 'member' });
const records = useRecordsStore();
</script>

<template>
  <RecordPage v-bind="records.deposit" />
</template>
