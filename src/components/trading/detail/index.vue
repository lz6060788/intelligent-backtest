<template>
  <div class="bg-gray-950 border border-gray-800 rounded-xl p-5">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-white font-semibold">{{ t(`${i18nPrefix}.title`) }}</h3>
        <div class="text-xs text-gray-500">
          {{ t(`${i18nPrefix}.filterByStrategy`) }}：<span
            id="trading-selected-label-trades"
            class="text-teal"
            >{{ t(`${i18nPrefix}.all`) }}</span
          >
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-gray-300 border-collapse">
          <thead
            class="text-xs text-gray-500 uppercase border-0 border-solid border-b border-gray-800"
          >
            <tr>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.time`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.symbol`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.side`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.quantity`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.price`) }}</th>
              <th class="py-2 text-left">{{ t(`${i18nPrefix}.strategy`) }}</th>
            </tr>
          </thead>
          <tbody
            id="trading-trades-body"
            class="divide-y divide-gray-800"
          >
            <template v-if="data.length > 0">
              <tr v-for="t in data" :key="t.symbol" class="hover:bg-gray-900/40 border-0 border-solid">
                <td class="py-2">{{ t.time }}</td>
                <td class="py-2">{{ t.symbol }}</td>
                <td class="py-2" :class="{ 'text-green-400': t.side === 'Buy', 'text-red-400': t.side === 'Sell' }">{{ t.side }}</td>
                <td class="py-2">{{ t.qty }}</td>
                <td class="py-2">{{ t.price }}</td>
                <td class="py-2">{{ t.strategy }}</td>
              </tr>
            </template>
            <template v-else>
              <tr class="hover:bg-gray-900/40">
                <td colspan="6" class="py-2 text-center text-gray-500">{{ t(`${i18nPrefix}.noTrades`) }}</td>
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

const i18nPrefix = 'trade.detail'

const props = defineProps<{
  data: any
}>()
</script>

<style scoped>
</style>