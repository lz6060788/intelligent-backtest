<template>
  <div
    class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5 xl:col-span-2 space-y-4"
  >
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
        <p class="text-xs text-gray-500">{{ t(`${i18nPrefix}.desc`) }}</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-400">
        <button
          @click="
            {
              performanceVisibility.strategy = !performanceVisibility.strategy;
              renderChart();
            }
          "
          class="px-2 py-1 rounded-md border-solid border border-gray-800 bg-gray-900 text-gray-300 flex items-center gap-1 text-white"
          :class="{
            'border-teal !text-teal': performanceVisibility.strategy,
          }"
        >
          <span class="w-2 h-2 rounded-full bg-teal"></span> This Strategy
        </button>
        <button
          @click="
            {
              performanceVisibility.benchmark =
                !performanceVisibility.benchmark;
              renderChart();
            }
          "
          class="px-2 py-1 rounded-md border-solid border border-gray-800 bg-gray-900 text-gray-300 flex items-center gap-1 text-white"
          :class="{
            'border-teal !text-teal': performanceVisibility.benchmark,
          }"
        >
          <span class="w-2 h-2 rounded-full bg-gray-500"></span> S&P 500
        </button>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div>
        <div class="text-[11px] text-gray-500 uppercase">{{ t(`${i18nPrefix}.historicalReturn`) }}</div>
        <div id="perf-strategy-return" class="text-lg font-bold text-teal">
          {{ data.stats.profit }}
        </div>
        <div class="text-[11px] text-gray-500">
          S&P 500
          <span id="perf-benchmark-return" class="text-gray-300">{{
            data.stats.benchReturn
          }}</span>
        </div>
      </div>
      <div>
        <div class="text-[11px] text-gray-500 uppercase">{{ t(`${i18nPrefix}.maxDrawdown`) }}</div>
        <div id="perf-strategy-dd" class="text-lg font-bold text-red-400">
          {{ data.stats.drawdown }}
        </div>
        <div class="text-[11px] text-gray-500">
          S&P 500
          <span id="perf-benchmark-dd" class="text-gray-300">{{
            data.stats.benchDrawdown
          }}</span>
        </div>
      </div>
    </div>
    <div
      class="h-[340px] w-full relative bg-gray-900/20 rounded-lg p-4 border border-gray-800/30"
    >
      <canvas id="equityChartOverview"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from "chart.js/auto";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const i18nPrefix = "strategy.detail.overview.performance";

const props = defineProps<{
  data: any;
}>();

let charts: Chart | null = null;
const performanceVisibility = ref({
  strategy: true,
  benchmark: true,
});

const renderChart = () => {
  const elementId = "equityChartOverview";
  const ctx = document.getElementById(elementId) as HTMLCanvasElement;
  if (!ctx) return;

  if (charts) {
    (charts as Chart).destroy();
    charts = null;
  }

  const perf = getPerformanceMock();
  const datasets = [];
  if (performanceVisibility.value.strategy) {
    datasets.push({
      type: "line",
      label: "This Strategy",
      data: perf.strategy,
      borderColor: "#00dbc3",
      backgroundColor: "rgba(0,219,195,0.12)",
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 0,
      fill: false,
      yAxisID: "y",
    });
    datasets.push({
      type: "bar",
      label: "Strategy Drawdown",
      data: perf.strategyDrawdown,
      backgroundColor: "rgba(0,219,195,0.22)",
      borderWidth: 0,
      yAxisID: "y1",
      barThickness: 6,
    });
  }
  if (performanceVisibility.value.benchmark) {
    datasets.push({
      type: "line",
      label: "S&P 500",
      data: perf.benchmark,
      borderColor: "#94a3b8",
      backgroundColor: "rgba(148,163,184,0.12)",
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 0,
      fill: false,
      yAxisID: "y",
    });
    datasets.push({
      type: "bar",
      label: "S&P 500 Drawdown",
      data: perf.benchmarkDrawdown,
      backgroundColor: "rgba(148,163,184,0.25)",
      borderWidth: 0,
      yAxisID: "y1",
      barThickness: 6,
    });
  }

  const chartConfig = {
    data: { labels: perf.labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: false,
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: (ctx: any) => {
              const v = typeof ctx.parsed.y === "number" ? ctx.parsed.y : 0;
              const name = ctx.dataset.label || "";
              return `${name}: ${v.toFixed(2)}%`;
            },
          },
        },
      },
      scales: {
        x: { display: false },
        y: {
          display: true,
          grid: { display: false },
          ticks: { display: false },
        },
        y1: { display: false, position: "right" },
      },
    },
  } as any;

  charts = new Chart(ctx, chartConfig);
};

const getPerformanceMock = () => {
  const points = 80;
  const labels = Array.from({ length: points }, (_, i) => `P${i + 1}`);
  let strategy = [];
  let bench = [];
  let baseS = 0;
  let baseB = 0;
  for (let i = 0; i < points; i++) {
    baseS += Math.random() * 2 - 0.5;
    baseB += Math.random() * 1.2 - 0.3;
    strategy.push(baseS);
    bench.push(baseB);
  }
  const drawdown = (arr: number[]) => {
    let peak = arr[0];
    return arr.map((v) => {
      peak = Math.max(peak || 0, v);
      return ((v - peak) / peak) * 100 || 0;
    });
  };
  const strategyDrawdown = drawdown(strategy.map((v) => 100 + v)).map((v) => v);
  const benchmarkDrawdown = drawdown(bench.map((v) => 100 + v)).map((v) => v);
  const normalize = (arr: number[]) => {
    const start = arr[0];
    return arr.map((v) => ((v - (start || 0)) / Math.abs(start || 1)) * 100);
  };
  return {
    labels,
    strategy: normalize(strategy.map((v) => 100 + v)),
    benchmark: normalize(bench.map((v) => 100 + v)),
    strategyDrawdown,
    benchmarkDrawdown,
  };
};

onMounted(() => {
  renderChart();
});
</script>

<style scoped></style>
