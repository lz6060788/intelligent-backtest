<template>
  <div class="p-8 max-w-7xl mx-auto animate-fade-in">
    <div class="flex justify-between items-end mb-8">
        <div>
            <h2 class="text-3xl font-bold text-white mb-2">{{ t(`${i18nPrefix}.title`) }}</h2>
            <p class="text-gray-400 text-sm">{{ t(`${i18nPrefix}.description`) }}</p>
        </div>
        <button class="px-4 py-2 bg-teal text-black font-bold rounded-lg text-sm hover:opacity-90 transition flex items-center gap-2 shadow-[0_0_15px_rgba(0,219,195,0.3)]">
            <RiAddLargeLine class="w-4 h-4" /> {{ t(`${i18nPrefix}.newScreener`) }}
        </button>
    </div>

    <div id="screener-lib-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 空状态 -->
    <Empty v-if="!screeners.length" :text="t(`${i18nPrefix}.empty`)" />

    <!-- 筛选器卡片列表 -->
    <ScreenerCard
      v-for="screener in screeners"
      :key="screener.id" :data="screener"
      :show-share-btn="true"
      :show-backtest-btn="true"
      :show-delete-btn="true"
      @delete="removeScreenerCard"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RiAddLargeLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import Empty from '@/components/base/empty.vue'
import ScreenerCard from '@/components/screener/card/index.vue'

const { t } = useI18n()

const i18nPrefix = 'screener'

const screeners = ref([
  {
    id: '1',
    title: 'Big Cap Momentum',
    lastRun: '2025-01-05',
    symbols: ['AAPL','MSFT','NVDA','GOOG','AMZN','META','TSLA','AVGO','LLY'],
    size: 12,
    tags: ['命中率 62%', '平均市值 $180B', '更新频率 周更']
  },
  {
    id: '2',
    title: 'Growth + QoQ Beats',
    lastRun: '2025-01-02',
    symbols: ['CRWD','NET','NOW','SNOW','MDB','PANW','ANET','SMCI','PATH'],
    size: 10,
    tags: ['命中率 58%', '营收环比 +12%', '高成长因子']
  }
]);

// 方法定义


const removeScreenerCard = (id: string) => {
  console.log(id);
  // 删除后更新列表
  screeners.value = screeners.value.filter(item => item.id !== id);
};

</script>

<style scoped>
.screener-card {
  @apply transition-all duration-200;
}

.teal {
  color: #4f46e5;
}
.teal-hover {
  background-color: #4338ca;
}
</style>