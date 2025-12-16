<template>
  <div
    class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5 space-y-3"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
      <div class="flex items-center gap-2">
        <button
          id="positions-table-btn"
          class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900 border-solid border border-gray-800 text-gray-400"
          @click="positionPanel = 'list'"
          :class="{
            'bg-teal text-gray-950': positionPanel === 'list',
            'hover:text-white': positionPanel !== 'list',
          }"
          :title="t(`${i18nPrefix}.list`)"
        >
          <RiTableFill class="w-4 h-4" />
        </button>
        <button
          id="positions-pie-btn"
          class="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900 border-solid border border-gray-800 text-gray-400"
          @click="positionPanel = 'pie'"
          :class="{
            'bg-teal text-gray-950': positionPanel === 'pie',
            'hover:text-white': positionPanel !== 'pie',
          }"
          :title="t(`${i18nPrefix}.chart`)"
        >
          <RiPieChartFill class="w-4 h-4" />
        </button>
      </div>
    </div>
    <StrategyOverviewPositionsList v-if="positionPanel === 'list'" :data="data.positions" />

    <StrategyOverviewPositionsChart v-if="positionPanel === 'pie'" :data="data.positions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { RiTableFill, RiPieChartFill } from '@remixicon/vue'

import StrategyOverviewPositionsList from './list/index.vue'
import StrategyOverviewPositionsChart from './chart/index.vue'

const { t } = useI18n()

const i18nPrefix = 'strategy.detail.overview.positions'

const positionPanel = ref("list");

const props = defineProps<{
  data: any;
}>();
</script>

<style scoped></style>
