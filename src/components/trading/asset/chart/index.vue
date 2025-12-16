<template>
  <div
    class="bg-gray-900/40 border-solid border border-gray-800 rounded-lg p-4 space-y-3"
  >
    <div class="flex items-center gap-3 text-sm">
      <button
        id="trading-chart-equity"
        @click="
          {
            tradeChart = 'equity';
            renderTradingCharts();
          }
        "
        :class="{ 'bg-teal text-gray-950 font-bold': tradeChart === 'equity' }"
        class="px-3 py-1.5 rounded-lg"
      >
      {{ t(`${i18nPrefix}.totalProfit`) }}
      </button>
      <button
        id="trading-chart-return"
        @click="
          {
            tradeChart = 'return';
            renderTradingCharts();
          }
        "
        :class="{ 'bg-teal text-gray-950 font-bold': tradeChart === 'return' }"
        class="px-3 py-1.5 rounded-lg"
      >
      {{ t(`${i18nPrefix}.returnRate`) }}
      </button>
    </div>
    <div class="h-64 relative">
      <canvas id="trading-main-chart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Chart from "chart.js/auto";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'trade.asset.chart'

const props = defineProps<{
  data: any
  tradeStrategy: string
}>()

const tradeChart = ref('equity');

let charts: any = null;
const renderTradingCharts = () => {
  if (!props.data) return;
  const chartId = 'trading-main-chart';
  const ctx = document.getElementById(chartId) as HTMLCanvasElement;
  if (!ctx) return;
  if (charts) { charts.destroy(); charts = null; }

  const isEquity = tradeChart.value === 'equity';
  const labels = (isEquity ? props.data.equity : props.data.returns).map((_: any, i: number) => `T${i+1}`);
  const dataset = {
      data: isEquity ? props.data.equity : props.data.returns,
      borderColor: isEquity ? '#00dbc3' : '#60a5fa',
      backgroundColor: isEquity ? 'rgba(0,219,195,0.15)' : 'rgba(96,165,250,0.18)',
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 0,
      fill: true
  };

  charts = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [dataset] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
          plugins: {
            // @ts-ignore
              legend: false,
              tooltip: {
                callbacks: {
                  label: (c: any)=> isEquity ? `$${c.parsed.y?.toLocaleString(undefined,{maximumFractionDigits:0})}` : `${c.parsed.y?.toFixed(2)}%` 
                }
              }
          },
          scales: { x: {display: false}, y: {display: false} }
      }
  });
}

onMounted(() => {
  renderTradingCharts();
})
</script>

<style scoped></style>
