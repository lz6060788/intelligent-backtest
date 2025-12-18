<template>
  <div v-if="data.ticker" class='mb-1 py-1 w-60'>
    <div class='flex justify-start items-center rounded-md p-1'>
      <div class='flex h-4 shrink-0 items-center rounded px-1 text-xs font-semibold uppercase text-text-secondary mr-1'>{{ t(`${i18nPrefix}.ticker`) }}</div>
      <span class="bg-gray-700 rounded-md px-2">
        {{ data.ticker }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodeProps } from '@/types'
import type { BacktestNodeType } from './types'
import { useI18n } from 'vue-i18n'

const i18nPrefix = 'workflow.nodes.backtest'

const { t } = useI18n()

const props = defineProps<NodeProps<BacktestNodeType>>();
</script>
