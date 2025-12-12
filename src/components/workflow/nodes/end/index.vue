<template>
  <div v-if="filteredOutputs.length > 0" className='mb-1 space-y-0.5 px-3 py-1'>
    <template v-for="(item, index) in filteredOutputs" :key="index">
      <VariableLabelInNode
        :variables="item.value_selector"
        :node-type="getNode(item.value_selector[0]!)?.data!.type"
        :node-title="getNode(item.value_selector[0]!)?.data!.title"
        :variable-type="getCurrentVariableType({
          valueSelector: item.value_selector,
          availableNodes,
          isChatMode: false,
        })"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useWorkflow } from '../../hooks';
import { useWorkflowVariables } from '../../hooks/use-workflow-variables';
import { BlockEnum, type NodeProps } from '@/types';
import type { EndNodeType } from './types';
import { computed } from 'vue';

const props = withDefaults(defineProps<NodeProps<EndNodeType>>(), {
});

const { getBeforeNodesInSameBranch } = useWorkflow()
const availableNodes = getBeforeNodesInSameBranch(props.id)
const { getCurrentVariableType } = useWorkflowVariables()

const startNode = availableNodes.find((node: any) => {
  return node.data.type === BlockEnum.Start
})

const getNode = (id: string) => {
  return availableNodes.find(node => node.id === id) || startNode
}

const outputs = computed(() => props.data.outputs)
const filteredOutputs = computed(() => outputs.value.filter(({ value_selector }) => value_selector.length > 0))
</script>
