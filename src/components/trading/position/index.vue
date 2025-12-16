<template>
  <div class="bg-gray-950 border-solid border border-gray-800 rounded-xl p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <button
            class="px-3 py-1 rounded-lg border-solid border border-gray-800 text-gray-300 hover:text-white hover:border-teal"
            onclick="app.generateMockSignals()"
          >
        {{ t(`${i18nPrefix}.simulateSignal`) }}
          </button>
          <span
            >{{ t(`${i18nPrefix}.filterByStrategy`) }}：<span id="trading-selected-label" class="text-teal"
              >{{ t(`${i18nPrefix}.all`) }}</span
            ></span
          >
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-gray-300 border-collapse">
          <thead
            class="text-xs text-gray-500 uppercase border-0 border-solid border-b border-gray-800"
          >
            <tr>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.symbol`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.quantity`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.value`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.strategy`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.profit`) }}</th>
            </tr>
          </thead>
          <tbody
            id="trading-holdings-body"
            class="border-0 border-solid divide-y divide-gray-800"
          >
          <template v-if="data.length > 0">
            <tr v-for="h in data" :key="h.symbol" class="hover:bg-gray-900/40 border-0 border-solid">
              <td class="py-2">{{ h.symbol }}</td>
              <td class="py-2">{{ h.qty }}</td>
              <td class="py-2">{{ h.value }}</td>
              <td class="py-2">{{ h.strategy }}</td>
              <td class="py-2">{{ h.pnl }}</td>
            </tr>
          </template>
          <template v-else>
            <tr class="hover:bg-gray-900/40">
              <td colspan="5" class="py-2 text-center text-gray-500">{{ t(`${i18nPrefix}.noPositions`) }}</td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'trade.position'

const props = defineProps<{
  data: any
}>()
</script>

<style scoped>
</style>