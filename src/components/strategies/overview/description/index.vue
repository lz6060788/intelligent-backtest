<template>
  <div
    class="lg:col-span-2 bg-gray-950 border-solid border border-gray-800 rounded-xl p-5 space-y-3"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
    </div>
    <p id="detail-desc" class="text-gray-400 text-sm leading-relaxed">
      {{ data.desc }}
    </p>
    <div class="flex gap-2 flex-wrap text-[11px]">
      <span
        class="px-2 py-1 rounded-full bg-gray-900 border-solid border border-gray-800 text-teal font-semibold"
        id="badge-symbol"
        >{{ data.symbol }}</span
      >
      <span
        class="px-2 py-1 rounded-full bg-gray-900 border-solid border border-gray-800 text-gray-300"
        id="badge-timeframe"
        >{{ t(`${i18nPrefix}.timeframe`) }}: {{ data.timeframe }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'strategy.detail.overview.description'

const props = defineProps<{
  data: any
}>()
</script>

<style scoped>
</style>