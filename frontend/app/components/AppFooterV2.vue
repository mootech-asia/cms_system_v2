<script setup lang="ts">
const { t } = useLocale();
</script>

<template>
  <footer class="bg-surface border-t border-line-soft py-12 pb-24 md:pb-16">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start md:text-left text-center">
        <div class="flex flex-col items-center md:items-start">
          <img :src="withBase('/logo.png')" alt="WIN100% Logo" class="h-12 mix-blend-lighten mb-3">
          <p class="text-ink-4 text-xs">{{ t('footer.tagline') }}</p>
        </div>
        <div class="max-w-md mx-auto md:mx-0">
          <p class="text-ink-3 text-xs leading-relaxed mb-3">{{ t('footer.responsible') }}</p>
          <p class="text-ink-3 text-xs leading-relaxed">{{ t('footer.cookies') }}</p>
        </div>
        <div class="flex items-center justify-center md:justify-end md:items-start md:h-full">
          <div class="text-xs text-ink-4">{{ t('footer.rights') }}</div>
        </div>
      </div>
    </div>
  </footer>
</template>
