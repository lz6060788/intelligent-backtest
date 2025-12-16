<template>
  <div
    class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5 space-y-3"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
      <span class="text-xs text-gray-500">{{ t(`${i18nPrefix}.tooltip`) }}</span>
    </div>
    <div
      id="trading-account-summary"
      class="grid grid-cols-2 gap-3 text-sm text-gray-300"
    >
      <div
        class="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-800"
      >
        <span class="text-gray-400">{{ t(`${i18nPrefix}.strategy`) }}</span>
        <span class="text-white font-semibold">{{
          getTradingStrategyName()
        }}</span>
      </div>
      <div
        class="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-800"
      >
        <span class="text-gray-400">{{ t(`${i18nPrefix}.totalAsset`) }}</span>
        <span class="text-white font-semibold">{{
          totalVal.toLocaleString()
        }}</span>
      </div>
      <div
        class="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-800"
      >
        <span class="text-gray-400">{{ t(`${i18nPrefix}.totalProfit`) }}</span>
        <span class="text-green-400 font-semibold">+12.3%</span>
      </div>
      <div
        class="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-800"
      >
        <span class="text-gray-400">{{ t(`${i18nPrefix}.totalPnl`) }}</span>
        <span class="text-green-400 font-semibold">+$8,900</span>
      </div>
      <div
        class="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-800"
      >
        <span class="text-gray-400">{{ t(`${i18nPrefix}.maxDrawdown`) }}</span>
        <span class="text-red-400 font-semibold">-9.8%</span>
      </div>
      <div
        class="flex items-center justify-between bg-gray-900/50 rounded-lg px-3 py-2 border border-gray-800"
      >
        <span class="text-gray-400">{{ t(`${i18nPrefix}.annualizedReturn`) }}</span>
        <span class="text-white font-semibold">18.2%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'trade.asset.overview'

const props = defineProps<{
  data: any
  tradeStrategy: string
}>()

const getTradingStrategyName = () => {
  const id = props.tradeStrategy
  if (id === 'all') return t(`${i18nPrefix}.all`);
  if (id === 'cash') return t(`${i18nPrefix}.cash`);
  const found = (props.data?.strategies || []).find((s: any) => s.id === id);
  return found ? found.name : id;
}

const totalVal = computed(() => {
  return (props.data?.strategies?.reduce((s: number, x: any) => s + (x.amount || 0), 0) || 0) + (props.data?.cash || 0);
})
</script>

<style scoped></style>
