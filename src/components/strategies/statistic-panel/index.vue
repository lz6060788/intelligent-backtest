<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
      <div
        class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
      >
        <div
          class="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold"
        >
          {{ t(`${i18nPrefix}.profit`) }}
          <span class="text-green-400"
            ><i class="fa-solid fa-arrow-up-right"></i
          ></span>
        </div>
        <div id="stat-profit" class="text-2xl font-bold text-green-400">
          {{ data.stats.profit }}
        </div>
      </div>
      <div
        class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
      >
        <div
          class="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold"
        >
          {{ t(`${i18nPrefix}.drawdown`) }}
          <span class="text-red-400"
            ><i class="fa-solid fa-arrow-trend-down"></i
          ></span>
        </div>
        <div id="stat-drawdown" class="text-2xl font-bold text-red-400">
          {{ data.stats.drawdown }}
        </div>
      </div>
      <div
        class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
      >
        <div
          class="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold"
        >
          {{ t(`${i18nPrefix}.profitFactor`) }}
        </div>
        <div id="stat-profit-factor" class="text-2xl font-bold text-white">
          {{ data.stats.profitFactor }}
        </div>
      </div>
      <div
        class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
      >
        <div
          class="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold"
        >
          {{ t(`${i18nPrefix}.winRate`) }}
        </div>
        <div id="stat-winrate" class="text-2xl font-bold text-blue-400">
          {{ data.stats.winrate }}
        </div>
      </div>
      <div
        class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-4 flex flex-col gap-2"
      >
        <div
          class="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold"
        >
          {{ t(`${i18nPrefix}.totalSignals`) }}
        </div>
        <div id="stat-signals" class="text-2xl font-bold text-teal">
          {{
            data.stats.signals ||
            (data.signals ? data.signals.length : "--")
          }}
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'strategy.detail.statisticPanel'

const props = defineProps<{
  data: any
}>()
</script>

<style scoped>
</style>