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
    <EdgeLabelRenderer
      class="nopan nodrag hover:scale-125"
      :class="[
        props.data?._hovering ? 'block' : 'hidden',
        open && '!block',
        data.isInIteration && `z-[${ITERATION_CHILDREN_Z_INDEX}]`,
        data.isInLoop && `z-[${LOOP_CHILDREN_Z_INDEX}]`,
      ]"
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${edgePathData.labelX}px, ${edgePathData.labelY}px)`,
        pointerEvents: 'all',
        opacity: 1,
      }"
    >
      123
    </EdgeLabelRenderer>
  </BaseEdge>
</template>

<script setup lang="ts">
import { type EdgeProps, getBezierPath, getBezierEdgeCenter, Position, BaseEdge, EdgeLabelRenderer } from '@vue-flow/core';
import type { Edge } from '@/types';
import { computed, ref } from 'vue';
import { LOOP_CHILDREN_Z_INDEX, ITERATION_CHILDREN_Z_INDEX } from '../nodes/_base/node/constant'

// const { availablePrevBlocks } = useAvailableBlocks((data as Edge['data'])!.targetType, (data as Edge['data'])?.isInIteration || (data as Edge['data'])?.isInLoop)
// const { availableNextBlocks } = useAvailableBlocks((data as Edge['data'])!.sourceType, (data as Edge['data'])?.isInIteration || (data as Edge['data'])?.isInLoop)

const props = withDefaults(defineProps<EdgeProps>(), {});
const edgePathData = computed(() => {
  const data = getBezierPath({
    sourceX: props.sourceX - 8,
    sourceY: props.sourceY,
    sourcePosition: Position.Right,
    targetX: props.targetX + 8,
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

// const handleInsert = (nodeType, toolDefaultValue) => {
//   handleNodeAdd(
//     {
//       nodeType,
//       toolDefaultValue,
//     },
//     {
//       prevNodeId: source,
//       prevNodeSourceHandle: sourceHandleId || 'source',
//       nextNodeId: target,
//       nextNodeTargetHandle: targetHandleId || 'target',
//     },
//   )
// }

const stroke = computed(() => {
    if (props.selected || props.data?._connectedNodeIsHovering)
      return 'var(--workflow-link-line__handle)'

    return 'var(--workflow-link-line__normal)'
})

const open = ref(false);
</script>
