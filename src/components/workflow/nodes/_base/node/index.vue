<template>
  <div
    :class="cn(
      'rounded-2xl border relative bg-gray-800 border-solid',
      showSelectedBorder ? 'border-blue-500' : 'border-transparent',
      'group relative pb-1 shadow-sm',
      (data.type !== BlockEnum.Loop) && 'w-[240px]',
      (data.type === BlockEnum.Loop) && 'flex h-full w-full flex-col',
      !data._runningStatus && 'hover:shadow-lg',
      borderStatus.showRunningBorder && '!border-state-accent-solid',
      borderStatus.showSuccessBorder && '!border-state-success-solid',
      borderStatus.showFailedBorder && '!border-state-destructive-solid',
      borderStatus.showExceptionBorder && '!border-state-warning-solid',
      data._isBundled && '!shadow-lg',
    )"
    ref="nodeRef"
    :style="_style"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center flex-1">
        <block-icon :type="data.type"></block-icon>
        <div class="flex-1 ellipsis ml-2">{{ data.title }}-{{ id }}-{{ data.selected }}-{{ data._isBundled }}-{{ data._isEntering }}</div>
      </div>
    </div>
    <slot></slot>
    <targetHandle v-if="showTargetHandle" handle-id="target" v-bind="props"></targetHandle>
    <sourceHandle v-if="showSourceHandle" handle-id="source" v-bind="props"></sourceHandle>
  </div>
</template>

<script setup lang="ts">
import { BlockEnum, NodeRunningStatus, type NodeProps } from '@/types/node';
import { computed, nextTick, ref, watchEffect } from 'vue';
import { NODE_PADDING_X, NODE_PADDING_Y } from './constant';
import BlockIcon from '../../../block-icon.vue';
import targetHandle from '../targetHandle/index.vue'
import sourceHandle from '../sourceHandle/index.vue'
import { useNodeLoopInteractions } from '../../loop/use-interactions'
import cn from '@/utils/classnames'

const { handleNodeLoopChildSizeChange } = useNodeLoopInteractions()

const nodeRef = ref(null)

const props = withDefaults(defineProps<NodeProps>(), {})

watchEffect((onCleanup) => {
  if (nodeRef.value && props.data.selected && props.data.isInLoop) {
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        handleNodeLoopChildSizeChange(props.id)
      }, 100)
    })

    resizeObserver.observe(nodeRef.value)

    onCleanup(() => {
      resizeObserver.disconnect()
    })
  }
})

const showSelectedBorder = computed(() => props.data.selected || props.data._isBundled || props.data._isEntering)
const _style = computed(() => ({
  width: (props.data.type === BlockEnum.Loop) ? props.data.width : 'auto',
  height: (props.data.type === BlockEnum.Loop) ? props.data.height : 'auto',
  padding: `${NODE_PADDING_Y}px ${NODE_PADDING_X}px`,
}))
// const hasVarValue = hasNodeInspectVars(props.id)
const hasVarValue = false
const borderStatus = computed(() => {
  return {
    showRunningBorder: props.data._runningStatus === NodeRunningStatus.Running && !showSelectedBorder,
    showSuccessBorder: (props.data._runningStatus === NodeRunningStatus.Succeeded || hasVarValue) && !showSelectedBorder,
    showFailedBorder: props.data._runningStatus === NodeRunningStatus.Failed && !showSelectedBorder,
    showExceptionBorder: props.data._runningStatus === NodeRunningStatus.Exception && !showSelectedBorder,
  }
})

const showSourceHandle = computed(() => ![BlockEnum.IfElse, BlockEnum.End].includes(props.data.type))
const showTargetHandle = computed(() => props.data.type !== BlockEnum.Start)
</script>

<style scoped>
</style>
