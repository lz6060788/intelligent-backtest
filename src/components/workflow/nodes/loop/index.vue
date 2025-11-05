<template>
  <div
    :class="cn(
      'relative h-full min-h-[90px] w-full min-w-[240px] rounded-2xl bg-gray-900',
    )"
  >
    <Background
      :id="`loop-background-${id}`"
      class="!z-0 rounded-2xl"
      :gap="[14 / zoom, 14 / zoom]"
      :size="2 / zoom"
      pattern-color="#fff"
    />
    <LoopStartNodeDumb v-if="data._isCandidate" />
    <AddBlock
      v-if="data._children!.length === 1"
      :loop-node-id="id"
      :loop-node-data="data"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useVueFlow, useNodesInitialized } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import type { NodeProps } from '@/types/node'
import type { LoopNodeType } from './type'
import LoopStartNodeDumb from '../loop-start/dumb.vue'
import { useNodeLoopInteractions } from './use-interactions'
import AddBlock from './add-block.vue'
import cn from '@/utils/classnames'

const props = defineProps<NodeProps<LoopNodeType>>()

const { id, data } = props
const { viewport } = useVueFlow()
const { handleNodeLoopRerender } = useNodeLoopInteractions()
const nodesInitialized = useNodesInitialized();

const zoom = computed(() => viewport.value.zoom)

// 监听节点初始化完成
watch([nodesInitialized], () => {
  handleNodeLoopRerender(id)
}, { immediate: true })
</script>

