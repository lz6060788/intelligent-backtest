<template>
  <NodeSelector
    v-bind="props"
    :blocks="blocks!"
    :width="180"
  >
    <template v-if="triggerSlot" #trigger="data">
      <slot name="trigger" :open="data?.open" />
    </template>
  </NodeSelector>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { NodeSelectorProps } from './main.vue'
import NodeSelector from './main.vue'
import { useNodesMetaData } from '../hooks/use-nodes-meta-data'
import { BlockEnum } from '@/types/node'
import type { NodeDefault } from '@/types/node'

const props = defineProps<NodeSelectorProps>()

const { nodes: availableNodesMetaData } = useNodesMetaData()

const blocks = computed(() => {
  const result = availableNodesMetaData || []

  return result.filter((block: NodeDefault) => {
    if (block.metaData.type === BlockEnum.Start)
      return false

    if (block.metaData.type === BlockEnum.End)
      return false

    if (block.metaData.type === BlockEnum.DataSource)
      return false

    if (block.metaData.type === BlockEnum.LoopStart)
      return false

    if (block.metaData.type === BlockEnum.CalculatorStart)
      return false

    return true
  })
})
const slots = useSlots();
const triggerSlot = computed(() => slots.trigger?.());
</script>

