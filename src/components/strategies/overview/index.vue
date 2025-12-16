<template>
  <div id="tab-overview" class="space-y-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StrategyOverviewDescription :data="data" />

        <StrategyOverviewSubscription :data="data" />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <StrategyOverviewPerformance :data="data" />

        <StrategyOverviewPositions :data="data" />
      </div>

      <StrategyOverviewSignals :data="signalsList" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StrategyOverviewDescription from './description/index.vue'
import StrategyOverviewSubscription from './subscription/index.vue'
import StrategyOverviewPerformance from './performance/index.vue'
import StrategyOverviewPositions from './positions/index.vue'
import StrategyOverviewSignals from './signals/index.vue'

const props = defineProps<{
  data: any
}>()

const signalsList = computed(() => {
  const signals = [...(props.data?.signals || [])];
  const ts = (t: string) => {
    const parsed = Date.parse((t || "").replace(" ", "T"));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  signals.sort((a, b) => {
    const diff = ts(b.entryTime) - ts(a.entryTime);
    if (diff !== 0) return diff;
    // If times equal, show pending before executed
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (b.status === "pending" && a.status !== "pending") return 1;
    return 0;
  });
  return signals.slice(0, 3);
});
</script>

<style scoped>
</style>