<template>
  <div
    id="positions-pie"
    class="w-full h-[220px] flex justify-between"
  >
    <div class="w-[220px] h-[220px]">
      <canvas id="positionsPieChart" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  data: any;
}>();

let charts: Chart | null = null;

const renderChart = () => {
  const elementId = "positionsPieChart";
  const ctx = document.getElementById(elementId) as HTMLCanvasElement;
  if (!ctx) return;
  if (charts) charts.destroy();
  const labels = props.data.map(p => p.symbol);
  const values = props.data.map(p => parseFloat((p.allocation || '0').replace('%','')) || 0);
  const colors = ['#00dbc3','#4ade80','#60a5fa','#fbbf24','#f472b6'];
  charts = new Chart(ctx, {
      type: 'doughnut',
      data: {
          labels,
          datasets: [{
              data: values,
              backgroundColor: labels.map((_,i)=> colors[i % colors.length]),
              borderWidth: 0
          }]
      },
      options: {
          plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } },
          cutout: '55%'
      }
  });
}

onMounted(() => {
  renderChart();
});
</script>

<style scoped>
</style>