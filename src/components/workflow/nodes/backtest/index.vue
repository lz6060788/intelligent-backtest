<template>
  <div v-if="data.ticker" class='mb-1 py-1 w-64'>
    <div class='flex justify-start items-center rounded-md p-1'>
      <div class='flex h-4 shrink-0 items-center rounded px-1 text-xs font-semibold uppercase text-text-secondary mr-1'>{{ t(`${i18nPrefix}.ticker`) }}</div>
      <span class="bg-gray-700 rounded-md px-2" v-if="data.ticker.pool_type !== PoolTypeEnum.custom || data.ticker.custom_config.source_type !== PoolSourceType.variable_ref">
        {{ tickerCode }}
      </span>
      <template v-else>
        <div class="space-y-1">          <VariableLabelInNode
            v-for="(variable, index) in tickerCode"
            :key="index"
            :variables="variable || []"
            :node-type="getNodeForVariable(variable as ValueSelector)?.data.type"
            :node-title="getNodeForVariable(variable as ValueSelector)?.data.title"
            :is-exception-variable="false"
            />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlockEnum, type NodeProps, type ValueSelector } from '@/types'
import { PoolSourceType, PoolTypeEnum, type BacktestNodeType } from './types'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSystemVar } from '../_base/variable/utils'

const i18nPrefix = 'workflow.nodes.backtest'

const { t } = useI18n()

const props = defineProps<NodeProps<BacktestNodeType>>();

  const presetCodeOptions = [
  {
    label: '全市场',
    value: 'entire_market',
  },
]

const tickerCode = computed(() => {
  return props.data.ticker.pool_type === PoolTypeEnum.preset
    ? props.data.ticker.preset_config.preset_code.map(item => presetCodeOptions.find(option => option.value === item)?.label).join('、')
    : props.data.ticker.custom_config.source_type === PoolSourceType.manual_list
      ? props.data.ticker.custom_config.tickers.join('、')
      : props.data.ticker.custom_config.reference_path
})

const { nodes } = useVueFlow()

const getNodeForVariable = (variable: ValueSelector) => {
  const isSystem = isSystemVar(variable)
  if (isSystem)
    return nodes.value.find(node => node.data.type === BlockEnum.Start)
  return nodes.value.find(node => node.id === variable[0])
}
</script>
