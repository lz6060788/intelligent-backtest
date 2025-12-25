<template>
  <div v-if="outputVars.length > 0" class='mb-1 py-1 w-60'>
    <div class='flex justify-start rounded-md p-1'>
      <div class='flex h-4 shrink-0 items-center rounded px-1 text-xs font-semibold uppercase text-text-secondary mr-1'>{{ t(`${i18nPrefix}.output`) }}</div>
      <div class='w-0 grow rounded-md text-xs'>
        <div v-for="variable in outputVars" :key="variable.alias" class="mb-1 last-of-type:mb-0 bg-gray-700 rounded-md p-1 flex">
          <p class="text-xs font-semibold text-text-secondary mr-1 inline-block flex-1 min-w-20 truncate">{{ variable.alias }}</p>
          <p class="text-xs uppercase text-text-secondary shrink-0 min-w-10 truncate">{{ variable.type }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VarType, type NodePanelProps } from '@/types';
import type { OperatorOverviewNodeType } from './types';
import { computed } from 'vue';
import { getOutputVars, transformVarType } from '@/components/workflow/nodes/operator-end/utils';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'workflow.nodes.operatorOverview'

const props = defineProps<NodePanelProps<OperatorOverviewNodeType>>()

const payload = computed(() => props.data)

const outputVars = computed(() => getOutputVars(payload.value.graph.nodes, payload.value.graph.edges).map(item => ({
  ...item,
  type: transformVarType(item.type!),
})))
</script>
