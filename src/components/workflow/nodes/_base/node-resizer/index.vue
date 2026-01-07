<template>
    <div :class="cn(
      'hidden group-hover:block',
      nodeData.selected && '!block',
    )">
      <NodeResizeControl
        position="bottom-right"
        :variant="ResizeControlVariant.Line"
        :node-id="nodeId"
        :node-data="nodeData"
        :minWidth="minSize.minWidth"
        :minHeight="minSize.minHeight"
        class="nodrag !border-none !bg-transparent"
        :is-visible="!getNodesReadOnly()"
        @resize="handleResize"
      >
        <div
          class="absolute cursor-nwse-resize bottom-[-16px] right-[-8px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.19009 11.8398C8.26416 10.6196 10.7144 8.16562 11.9297 5.08904" stroke="white" strokeOpacity="0.16" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </NodeResizeControl>
    </div>
</template>

<script setup lang="ts">
import { useNodesInteractions, useNodesReadOnly } from '@/components/workflow/hooks'
import { BlockEnum, type CommonNodeType, type GraphNode } from '@/types'
import cn from '@/utils/classnames'
import { useVueFlow } from '@vue-flow/core'
import { NodeResizeControl, NodeResizer, ResizeControlVariant } from '@vue-flow/node-resizer'
import { computed } from 'vue'
import { ITERATION_PADDING, LOOP_PADDING } from '../node/constant'
import { debounce } from 'lodash-es'


type NodeResizerProps = {
  nodeId: string
  nodeData: CommonNodeType
  minWidth?: number
  minHeight?: number
  maxWidth?: number
}

const props = withDefaults(defineProps<NodeResizerProps>(), {
  nodeId: '',
  minWidth: 272,
  minHeight: 150,
})
const { getNodesReadOnly } = useNodesReadOnly();

const store = useVueFlow();
const minSize = computed(() => {
  const { nodes } = store

  const currentNode = nodes.value.find(n => n.id === props.nodeId)!
  const childrenNodes = nodes.value.filter(n =>
    currentNode.data._children?.find((c: any) => c.nodeId === n.id),
  )
  let rightNode: GraphNode
  let bottomNode: GraphNode

  childrenNodes.forEach((n) => {
    if (rightNode) {
      if (n.position.x + (n.dimensions.width as number) > rightNode.position.x + (rightNode.dimensions.width as number))
        rightNode = n
    }
    else {
      rightNode = n
    }
    if (bottomNode) {
      if (
        n.position.y + (n.dimensions.height as number)
        > bottomNode.position.y + (bottomNode.dimensions.height as number)
      )
        bottomNode = n
    }
    else {
      bottomNode = n
    }
  })

  let minWidth = 0
  let minHeight = 0
  if (rightNode! && bottomNode!) {
    const parentNode = nodes.value.find(n => n.id === rightNode.parentNode)
    const paddingMap
      = parentNode?.data.type === BlockEnum.Iteration
        ? ITERATION_PADDING
        : LOOP_PADDING

    minWidth = rightNode!.position.x + (rightNode.dimensions.width as number) + paddingMap.right
    minHeight = bottomNode.position.y + (bottomNode.dimensions.height as number) + paddingMap.bottom
  }

  return {
    minWidth: Math.max(minWidth, props.minWidth || 0),
    minHeight: Math.max(minHeight, props.minHeight || 0),
  }
})

const { handleNodeResize } = useNodesInteractions()

const handleResize = debounce(() => {
  handleNodeResize(props.nodeId)
}, 300)
</script>

<style scoped>
</style>