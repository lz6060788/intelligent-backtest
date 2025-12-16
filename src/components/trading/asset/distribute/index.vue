<template>
  <div
    class="bg-gray-900/40 border-solid border border-gray-800 rounded-lg p-4 space-y-3"
  >
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-white font-semibold text-sm">{{ t(`${i18nPrefix}.title`) }}</h3>
        <p class="text-[11px] text-gray-500">{{ t(`${i18nPrefix}.tooltip`) }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="text-xs px-3 py-1 rounded-lg bg-gray-800 text-gray-300 border-solid border border-gray-700 hover:border-teal hover:text-teal"
          onclick="app.openTradingAllocator()"
        >
        {{ t(`${i18nPrefix}.allocateButton`) }}
        </button>
        <span class="text-xs text-gray-500">{{ t(`${i18nPrefix}.cashTooltip`) }}</span>
      </div>
    </div>
    <div
      id="trading-allocation-bar"
      class="flex h-10 rounded-lg overflow-hidden border-solid border border-gray-800"
    >
      <!-- 策略分配项 -->
      <div
        v-for="(s, idx) in data.strategies"
        :key="s.id"
        :style="{ width: getPct(s.amount) + '%' }"
        :title="`${s.name} · $${formatNumber(s.amount)}`"
        class="h-full cursor-pointer relative"
        :class="{ 'ring-2 ring-white/60': tradeStrategy === s.id }"
        @click="selectTradingStrategy(s.id)"
      >
        <div
          :style="{ background: getColor(idx) }"
          class="h-full opacity-80"
        ></div>
      </div>

      <!-- 现金分配项 -->
      <div
        :style="{ width: getPct(data.cash) + '%' }"
        :title="`Cash · ${formatNumber(data.cash, true)}`"
        class="h-full cursor-pointer relative"
        :class="{ 'ring-2 ring-white/60': tradeStrategy === 'cash' }"
        @click="selectTradingStrategy('cash')"
      >
        <div style="background: #94a3b8" class="h-full opacity-70"></div>
      </div>
    </div>
    <div
      id="trading-strategy-cards"
      class="grid grid-cols-1 md:grid-cols-3 gap-3"
    >
      <div
        v-for="(s, idx) in data.strategies"
        :key="s.id"
        @click="selectTradingStrategy(s.id)"
        class="border-solid border rounded-lg p-3 bg-gray-900/40 hover:border-teal/60 transition cursor-pointer"
        :class="{
          'border-teal': tradeStrategy === s.id,
          'border-gray-800': tradeStrategy !== s.id,
        }"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-white font-semibold text-sm">{{ s.name }}</span>
          <span class="text-xs" :style="{ color: getColor(idx) }"
            >{{ getPct(s.amount).toFixed(1) }}%</span
          >
        </div>
        <div class="text-xs text-gray-500">
        {{ t(`${i18nPrefix}.amount`) }} {{ s.amount ? "$" + formatNumber(s.amount) : "--" }}
        </div>
        <div class="flex items-center justify-between text-xs mt-1">
          <span class="text-gray-400">{{ t(`${i18nPrefix}.duration`) }}</span>
          <span class="text-white font-semibold">{{ s.days }}</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-400">{{ t(`${i18nPrefix}.profit`) }}</span>
          <span
            class="font-semibold"
            :class="{
              'text-red-400': s.pnl.startsWith('-'),
              'text-green-400': !s.pnl.startsWith('-'),
            }"
          >
            {{ s.pnl }}
          </span>
        </div>
        <div class="mt-2">
          <button
            @click.stop="rebalanceStrategyAmount(s.id)"
            class="w-full text-xs bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg py-1 border-solid border border-gray-700"
          >
            {{ t(`${i18nPrefix}.adjustAllocation`) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'trade.asset.distribute'

const props = defineProps<{
  data: any
  tradeStrategy: string
}>()
const emit = defineEmits(['selectTradingStrategy']);

// 获取颜色
const getColor = (idx: number) => {
  const colors = ['#00dbc3','#60a5fa','#fbbf24','#f472b6','#34d399'];
  return colors[idx % 5];
};

const totalVal = computed(() => {
  return (props.data?.strategies?.reduce((s: number, x: any) => s + (x.amount || 0), 0) || 0) + (props.data?.cash || 0);
})

// 获取百分比
const getPct = (amount: number) => {
  return totalVal.value ? (amount || 0) / totalVal.value * 100 : 0;
};

// 格式化数字（千分位）
const formatNumber = (num: number, isCash = false) => {
  if (num === 0 && isCash) return '$0';
  if (!num) return isCash ? '$0' : '--';
  return num.toLocaleString();
};

// 选择策略
const selectTradingStrategy = (strategyId: string) => {
  emit('selectTradingStrategy', strategyId);
  // 这里可以添加原app.selectTradingStrategy的业务逻辑
  console.log('选中策略:', strategyId);
};

// 调整策略分配金额
const rebalanceStrategyAmount = (strategyId: string) => {
  // 这里可以添加原app.rebalanceStrategyAmount的业务逻辑
  console.log('调整策略分配:', strategyId);
};

</script>

<style scoped></style>
