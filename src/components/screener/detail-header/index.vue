<template>
  <div class="flex items-center justify-between">
    <div>
      <h2 id="detail-scr-title" class="text-2xl font-bold text-white">
        Screener
      </h2>
      <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
        <span
          id="detail-scr-size"
          class="px-2 py-1 rounded-full bg-gray-900 border-solid border border-gray-800 text-teal font-semibold"
          >-- {{ t(`${i18nPrefix}.symbols`) }}</span
        >
        <span
          id="detail-scr-date"
          class="px-2 py-1 rounded-full bg-gray-900 border-solid border border-gray-800 text-gray-300"
          >{{ t(`${i18nPrefix}.date`) }}：--</span
        >
        <span
          id="detail-scr-cycle"
          class="px-2 py-1 rounded-full bg-gray-900 border-solid border border-gray-800 text-gray-300"
          >{{ t(`${i18nPrefix}.cycle`) }}：--</span
        >
        <span
          id="detail-scr-hit"
          class="px-2 py-1 rounded-full bg-gray-900 border-solid border border-gray-800 text-gray-300"
          >{{ t(`${i18nPrefix}.hit`) }}：--</span
        >
      </div>
    </div>
    <div class="flex gap-2">
      <button
        id="detail-scr-share"
        class="px-4 py-2 bg-gray-900 text-white rounded-lg border-solid border border-gray-700 hover:bg-gray-800 text-sm font-medium transition flex items-center gap-2"
      >
        <RiShareLine class="w-4 h-4" /> {{ t(`${i18nPrefix}.share`) }}
      </button>
      <button
        id="detail-scr-backtest"
        class="px-4 py-2 bg-teal text-gray-950 rounded-lg font-bold hover:bg-teal-hover text-sm transition shadow-[0_0_15px_rgba(0,219,195,0.4)] flex items-center gap-2"
      >
        <RiPlayFill class="w-4 h-4" /> {{ t(`${i18nPrefix}.backtest`) }}
      </button>
      <button
        @click="navigateToScreenerList"
        class="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border-solid border border-gray-700 hover:bg-gray-700 text-sm transition flex items-center gap-2"
      >
        <RiCornerDownLeftFill class="w-4 h-4" /> {{ t(`${i18nPrefix}.return`) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RiShareLine, RiPlayFill, RiCornerDownLeftFill } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'screener.detail.header'

const router = useRouter()

const navigateToScreenerList = () => {
  router.push('/screener')
}
</script>

<style scoped></style>
