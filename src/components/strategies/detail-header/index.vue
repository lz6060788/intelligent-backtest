<template>
  <div
    class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
  >
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span
          class="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.8)]"
        ></span>
        <h2 id="detail-title" class="text-2xl font-bold text-white">
          {{ data.title }}
        </h2>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span id="detail-author" class="text-gray-400">{{
          data.author
        }}</span>
        <span class="w-1 h-1 rounded-full bg-gray-700"></span>
        <span
          id="detail-symbol"
          class="px-2 py-1 rounded border-solid border border-gray-800 bg-gray-900 text-teal text-[11px] font-semibold"
          >{{ data.symbol }}</span
        >
        <span
          id="detail-timeframe"
          class="px-2 py-1 rounded border-solid border border-gray-800 bg-gray-900 text-gray-300 text-[11px]"
          >{{ data.timeframe }}</span
        >
        <span
          id="detail-connections"
          class="px-2 py-1 rounded border-solid border border-gray-800 bg-gray-900 text-gray-300 text-[11px] flex items-center gap-1"
          ><i class="fa-solid fa-plug text-teal"></i>
          {{ data.connections }} {{ t(`${i18nPrefix}.connections`) }}</span
        >
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <div class="text-right pr-3 border-r border-gray-800">
        <div class="text-xs text-gray-500 uppercase font-bold">
          {{ t(`${i18nPrefix}.totalProfit`) }}
        </div>
        <div
          id="detail-total-profit"
          class="text-green-400 text-xl font-bold leading-tight"
        >
          {{ data.stats.profit }}
        </div>
      </div>
      <button
        id="btn-view-chat"
        class="hidden px-4 py-2 bg-gray-800 text-teal border-solid border border-teal/30 hover:bg-gray-700 text-sm font-medium transition items-center gap-2 rounded-lg"
      >
        <RiMessage3Fill class="w-4 h-4" /> {{ t(`${i18nPrefix}.viewSessionContext`) }}
      </button>
      <button
        id="btn-favorite"
        class="px-4 py-2 bg-gray-900 text-white rounded-lg border-solid border border-gray-700 hover:bg-gray-800 text-sm font-medium transition flex items-center gap-2"
      >
        <RiStarFill class="w-4 h-4" /> {{ t(`${i18nPrefix}.favorite`) }}
      </button>
      <button
        class="px-4 py-2 bg-gray-900 text-white rounded-lg border-solid border border-gray-700 hover:bg-gray-800 text-sm font-medium transition flex items-center gap-2"
      >
        <RiShare2Fill class="w-4 h-4" /> {{ t(`${i18nPrefix}.share`) }}
      </button>
      <button
        class="px-4 py-2 bg-teal text-gray-950 rounded-lg font-bold hover:bg-teal-hover text-sm transition shadow-[0_0_15px_rgba(0,219,195,0.4)] flex items-center gap-2"
      >
        <RiPlugFill class="w-4 h-4" /> {{ t(`${i18nPrefix}.connect`) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiStarFill, RiShare2Fill, RiPlugFill, RiMessage3Fill } from '@remixicon/vue'

const { t } = useI18n()

const i18nPrefix = 'strategy.detail.header'

// Props
const props = defineProps<{
  data: any
}>();
</script>

<style scoped></style>
