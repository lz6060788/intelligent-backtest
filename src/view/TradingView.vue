<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
    <div class="flex items-center gap-3 border-0 border-solid border-b border-gray-800 pb-2">
      <button
        id="trading-tab-sim"
        @click="tradingTab = 'sim'"
        :class="{ 'bg-teal text-gray-950': tradingTab === 'sim' }"
        class="px-4 py-2 rounded-lg text-sm font-bold"
      >
        {{ t(`${i18nPrefix}.simulation`) }}
      </button>
      <button
        id="trading-tab-live"
        @click="tradingTab = 'live'"
        :class="{ 'bg-teal text-gray-950': tradingTab === 'live' }"
        class="px-4 py-2 rounded-lg text-sm"
      >
        {{ t(`${i18nPrefix}.real`) }}
      </button>
    </div>
    <div
      id="trading-pending"
      class="hidden bg-amber-500/10 border-solid border border-amber-500/30 text-amber-300 text-sm px-4 py-3 rounded-lg flex items-center justify-between"
    >
      <span
        ><i class="fa-solid fa-circle-exclamation mr-2"></i>
        {{ t(`${i18nPrefix}.allocateTooltip`) }}</span
      >
      <button
        onclick="app.scrollToAllocation()"
        class="text-xs text-amber-100 underline"
      >
      {{ t(`${i18nPrefix}.allocateButton`) }}
      </button>
    </div>
    <div id="trading-pending-list" class="hidden space-y-2"></div>

    <tradingAsset :data="currentData" :tradeStrategy="tradeStrategy" @selectTradingStrategy="(strategyId: string) => tradeStrategy = strategyId" />

    <tradingAssetPosition :data="tradingHoldingsBody" />

    <tradingDetail :data="tradingTradesBody" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import tradingAsset from '@/components/trading/asset/index.vue'
import tradingAssetPosition from '@/components/trading/position/index.vue'
import tradingDetail from '@/components/trading/detail/index.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'trade'

const tradingTab = ref('sim');

const tradeStrategy = ref('all');

const tradingData = ref({
  sim: {
      equity: [100000,102500,101200,104800,108200,110500,112300,113800],
      returns: [0,2.5,1.2,4.8,8.2,10.5,12.3,13.8],
      strategies: [
          { id: 'strat-a', name: 'BTC Momentum', allocation: 55, amount: 62000, pnl: '+8.4%', days: 42 },
          { id: 'strat-b', name: 'ETH Swing', allocation: 30, amount: 34000, pnl: '+5.2%', days: 30 },
          { id: 'strat-c', name: 'SOL Grid', allocation: 15, amount: 18000, pnl: '+2.1%', days: 18 }
      ],
      cash: 8000,
      holdings: [
          { symbol: 'BTC', qty: '1.05', value: '$52,000', strategy: 'strat-a', pnl: '+6.5%' },
          { symbol: 'ETH', qty: '14.3', value: '$32,500', strategy: 'strat-b', pnl: '+3.2%' },
          { symbol: 'SOL', qty: '260', value: '$16,800', strategy: 'strat-c', pnl: '+1.9%' }
      ],
      trades: [
          { time: '2025-01-05 14:20', symbol: 'BTC', side: 'Buy', qty: '0.25', price: '$49,800', strategy: 'strat-a' },
          { time: '2025-01-05 11:00', symbol: 'ETH', side: 'Sell', qty: '3.5', price: '$2,450', strategy: 'strat-b' },
          { time: '2025-01-04 20:10', symbol: 'SOL', side: 'Buy', qty: '120', price: '$65.3', strategy: 'strat-c' }
      ]
  },
  live: null // reuse sim data
})
const currentData = computed(() => tradingData.value[tradingTab.value as keyof typeof tradingData.value] || { strategies: [], cash: 0, holdings: [], trades: [] })

const tradingHoldingsBody = computed(() => {
  return currentData.value.holdings.filter(h => tradeStrategy.value === 'all' || h.strategy === tradeStrategy.value)
})

const tradingTradesBody = computed(() => {
  return currentData.value.trades.filter(t => tradeStrategy.value === 'all' || t.strategy === tradeStrategy.value)
})

</script>

<style scoped></style>
