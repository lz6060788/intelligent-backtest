<template>
  <BaseEdge
    :id="props.id"
    :path="edgePathData.edgePath"
    :style="{
      stroke,
      strokeWidth: 2,
      opacity: 1,
    }"
  >
  </BaseEdge>
  <EdgeLabelRenderer>
    <div
      :style="{
        display: isHovering ? 'block' : 'none',
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${edgePathData.labelX}px,${edgePathData.labelY}px)`,
      }"
      class="nodrag nopan"
    >
      <blockSelector
        @select="handleInsert"
        placement='right'
        :triggerClassName="() => 'hover:scale-150 transition-all'"
        :availableBlocksTypes="availableBlocks"
      >
      </blockSelector>
    </div>
  </EdgeLabelRenderer>
</template>

<script setup lang="ts">
import { type EdgeProps, getBezierPath, getBezierEdgeCenter, Position, BaseEdge, EdgeLabelRenderer } from '@vue-flow/core';
import type { BlockEnum, Edge } from '@/types';
import { computed, ref } from 'vue';
import { LOOP_CHILDREN_Z_INDEX, ITERATION_CHILDREN_Z_INDEX } from '../nodes/_base/node/constant'
import { useAvailableBlocks } from '../hooks';
import blockSelector from '../block-selector/index.vue';
import { useNodesInteractions } from '../hooks/use-node-interactions';

const props = withDefaults(defineProps<EdgeProps>(), {});

const { availablePrevBlocks } = useAvailableBlocks((props.data as Edge['data'])!.targetType, (props.data as Edge['data'])?.isInLoop)
const { availableNextBlocks } = useAvailableBlocks((props.data as Edge['data'])!.sourceType, (props.data as Edge['data'])?.isInLoop)
const availableBlocks = computed(() => {
  return [...availablePrevBlocks, ...availableNextBlocks]
})

const edgePathData = computed(() => {
  const data = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: Position.Right,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: Position.Left,
    curvature: 0.16
  })
  return {
    edgePath: data[0],
    labelX: data[1],
    labelY: data[2]
  }
})

const { handleNodeAdd } = useNodesInteractions()
const handleInsert = (nodeType: BlockEnum) => {
  handleNodeAdd(
    {
      nodeType,
    },
    {
      prevNodeId: props.source,
      prevNodeSourceHandle: props.sourceHandleId || 'source',
      nextNodeId: props.target,
      nextNodeTargetHandle: props.targetHandleId || 'target',
    },
  )
}

const stroke = computed(() => {
    if (props.selected || props.data?._connectedNodeIsHovering)
      return 'var(--workflow-link-line__handle)'

    return 'var(--workflow-link-line__normal)'
})

const isHovering = computed(() => {
  return props.data?._hovering
})
</script>
