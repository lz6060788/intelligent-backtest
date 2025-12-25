<template>
  <Handle
    :id="props.handleId"
    type="source"
    :position="Position.Right"
    :class="_cls"
    :isConnectable="isConnectable"
    @click="handleHandleClick"
  >
    <BlockSelector
      v-if="isConnectable && !getNodesReadOnly()"
      @select="handleSelect"
      placement='right'
      :triggerClassName="open => `
          hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
          ${props.nodeSelectorClassName || ''}
          group-hover:!flex
          ${props.data.selected ? '!flex' : ''}
        `"
      :availableBlocksTypes="availableNextBlocks"
    >
    </BlockSelector>
  </Handle>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { BlockEnum, type HandleProps, NodeRunningStatus } from '@/types';
import BlockSelector from '@/components/workflow/block-selector/index.vue'
import { useNodesInteractions } from '@/components/workflow/hooks/use-node-interactions'
import { useAvailableBlocks } from '@/components/workflow/hooks/use-available-blocks'
import { computed } from 'vue';
import cn from '@/utils/classnames'
import { useNodesReadOnly } from '@/components/workflow/hooks/use-workflow'

const { handleNodeAdd } = useNodesInteractions()

const props = withDefaults(defineProps<HandleProps>(), {});

const { getNodesReadOnly } = useNodesReadOnly()

const { availableNextBlocks } = useAvailableBlocks(props.data.type, props.data.isInIteration || props.data.isInLoop)
const isConnectable = computed(() => !!availableNextBlocks.length)
const handleHandleClick = (e: MouseEvent) => {
  e.stopPropagation()
}
const handleSelect = (type: BlockEnum) => {
  handleNodeAdd(
    {
      nodeType: type,
    },
    {
      prevNodeId: props.id,
      prevNodeSourceHandle: props.handleId,
    },
  )
}
const connected = computed(() => props.data._connectedSourceHandleIds?.includes(props.handleId))

const _cls = computed(() => cn(
  'transition-all origin-center group',
  props.data._runningStatus === NodeRunningStatus.Succeeded && 'after:bg-workflow-link-line-success-handle',
  props.data._runningStatus === NodeRunningStatus.Failed && 'after:bg-workflow-link-line-error-handle',
  props.showExceptionStatus && props.data._runningStatus === NodeRunningStatus.Exception && 'after:bg-workflow-link-line-failure-handle',
  !connected && 'after:opacity-0',
  props.handleClassName,
))

</script>
