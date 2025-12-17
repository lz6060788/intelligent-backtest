<template>
  <div v-if="outputVars.length > 0" class='mb-1 py-1 w-60'>
    <div class='flex justify-start rounded-md p-1'>
      <div class='flex h-4 shrink-0 items-center rounded px-1 text-xs font-semibold uppercase text-text-secondary mr-1'>{{ t(`${i18nPrefix}.output`) }}</div>
      <div class='w-0 grow rounded-md text-xs'>
        <p v-for="variable in outputVars" :key="variable.alias" class="mb-1 last-of-type:mb-0 bg-gray-700 rounded-md p-1 flex">
          <p class="text-xs font-semibold text-text-secondary mr-1 inline-block flex-1 min-w-20 truncate">{{ variable.alias }}</p>
          <p class="text-xs uppercase text-text-secondary shrink-0 min-w-10 truncate">{{ variable.type }}</p>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NodePanelProps } from '@/types';
import type { OperatorEndNodeType } from './types';
import { computed } from 'vue';
import { getOutputVars } from './utils';
import { useWorkflowInstance } from '@/components/workflow/hooks/index'
import { useVueFlow } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const i18nPrefix = 'workflow.nodes.operatorEnd'

const { instanceId } = useWorkflowInstance()
const store = useVueFlow(instanceId)
const { nodes, edges } = store
const props = defineProps<NodePanelProps<OperatorEndNodeType>>()

const payload = computed(() => props.data)

const outputVars = computed(() => getOutputVars(nodes.value, edges.value))
interface Props {
}
</script>
