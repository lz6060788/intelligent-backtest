<template>
  <div
    class="bg-gray-900/40 border-solid border border-gray-800 rounded-lg p-3 flex flex-col gap-2"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span
          class="w-8 h-8 rounded-full flex items-center justify-center border-solid border"
          :class="{
            'bg-green-500/10 text-green-400': data.direction === 'long',
            'bg-red-500/10 text-red-400': data.direction === 'short',
            'border-green-500/30': data.direction === 'long',
            'border-red-500/30': data.direction === 'short',
          }"
        >
          <RiArrowDownFill
            v-if="data.direction === 'long'"
            class="w-4 h-4 rotate-180"
          />
          <RiArrowDownFill v-else class="w-4 h-4" />
        </span>
        <div>
          <div class="text-white font-semibold">
            {{ data.symbol }}
          </div>
          <div class="text-[11px] text-gray-500">
            {{ t(`${i18nPrefix}.entryPrice`) }}: {{ data.entryPrice }} · {{ t(`${i18nPrefix}.exitPrice`) }}:
            {{ data.exitPrice || "--" }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div
          :class="{
            'text-red-400': data.pnl.startsWith('-'),
            'text-green-400': !data.pnl.startsWith('-'),
          }"
          class="font-bold"
        >
          {{ data.pnl }}
        </div>
        <span
          v-if="data.status === 'executed'"
          class="px-2 py-1 text-[11px] rounded-full bg-green-500/10 text-green-400 border-solid border border-green-500/30"
          >{{ t(`${i18nPrefix}.executed`) }}</span
        >
        <span
          v-else
          class="px-2 py-1 text-[11px] rounded-full bg-yellow-500/10 text-yellow-400 border-solid border border-yellow-500/30"
          >{{ t(`${i18nPrefix}.pending`) }}</span
        >
        <div class="text-[11px] text-gray-500">
          {{ formatAgo(data.agoMins || 0) }}
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2 text-xs text-gray-400">
      <div>
        {{ t(`${i18nPrefix}.entryTime`) }}:
        <span class="text-white">{{ data.entryTime }}</span>
      </div>
      <div class="text-right sm:text-left">
        {{ t(`${i18nPrefix}.exitTime`) }}:
        <span class="text-white">{{ data.exitTime || "--" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiArrowDownFill } from '@remixicon/vue'

const { t } = useI18n()
defineProps<{
  data: any
}>()

const i18nPrefix = 'strategy.detail.signals'

const formatAgo = (mins: number) => {
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};
</script>

<style scoped>
</style>