<script setup lang="ts">
const { t } = useLocale();
</script>

<template>
  <footer class="bg-surface border-t border-line-soft py-12 pb-24 md:pb-16">
    <div class="container mx-auto px-4">
      <div class="flex flex-col items-center">
        <img :src="withBase('/logo.png')" alt="WIN100% Logo" class="h-12 mix-blend-lighten mb-6">
        <div class="text-center" style="max-width:42rem">
          <p class="text-ink-3 text-xs leading-relaxed mb-3">{{ t('footer.responsible') }}</p>
          <p class="text-ink-3 text-xs leading-relaxed">{{ t('footer.cookies') }}</p>
        </div>
        <div class="h-px w-full bg-line-soft" style="max-width:42rem;margin:24px 0"></div>
        <div class="text-xs text-ink-4">{{ t('footer.rights') }}</div>
      </div>
    </div>
  </footer>
</template>
