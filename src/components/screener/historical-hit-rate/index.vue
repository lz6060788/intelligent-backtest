<template>
  <div class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
      <span class="text-xs text-gray-500">{{ t(`${i18nPrefix}.statisticsBy`) }}</span>
    </div>
    <div class="h-64">
      <canvas id="screener-hit-chart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'screener.detail.historicalHitRate'
</script>

<style scoped></style>
