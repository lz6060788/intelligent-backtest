<template>
  <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
    <div
      class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5 xl:col-span-2 space-y-5"
    >
      <tradingAssetChart :data="data" :tradeStrategy="tradeStrategy" />

      <tradingAssetDistribute :data="data" :tradeStrategy="tradeStrategy" @selectTradingStrategy="selectTradingStrategy" />
    </div>

    <tradingAssetOverview :data="data" :tradeStrategy="tradeStrategy" />
  </div>
</template>

<script setup lang="ts">
import tradingAssetOverview from '@/components/trading/asset/overview/index.vue'
import tradingAssetChart from '@/components/trading/asset/chart/index.vue'
import tradingAssetDistribute from '@/components/trading/asset/distribute/index.vue'

const emit = defineEmits(['selectTradingStrategy']);

const props = defineProps<{
  data: any
  tradeStrategy: string
}>()

const selectTradingStrategy = (strategyId: string) => {
  emit('selectTradingStrategy', strategyId);
}
</script>

<style scoped>
</style>