<script setup lang="ts">
/**
 * 統一頁籤(PrimeVue Tabs 包裝)。
 * 用法:tabs=[{label,value}],每個 value 對應一個同名槽位放面板內容。
 * 外觀由 Win100 preset 集中控制。
 */
const props = defineProps<{
  tabs: { label: string; value: string }[]
}>()

const value = defineModel<string>()
if (value.value === undefined && props.tabs.length) value.value = props.tabs[0]!.value
</script>

<template>
  <Tabs v-model:value="value" class="min-w-0">
    <!-- 手機保持單列頁籤並允許水平滑動,避免頁籤壓縮或撐寬整頁 -->
    <div class="max-w-full overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <TabList class="min-w-max">
        <Tab v-for="t in tabs" :key="t.value" class="shrink-0 whitespace-nowrap" :value="t.value">{{ t.label }}</Tab>
      </TabList>
    </div>
    <TabPanels class="min-w-0">
      <TabPanel v-for="t in tabs" :key="t.value" class="min-w-0" :value="t.value">
        <slot :name="t.value" :tab="t" />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
