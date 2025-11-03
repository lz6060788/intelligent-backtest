<template>
  <div
    class="rounded-2xl border relative bg-gray-800 border-solid"
    :class="_cls"
    ref="nodeRef"
    :style="_style"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center flex-1">
        <node-icon></node-icon>
        <div class="flex-1 ellipsis ml-2">{{ props.data.title }}</div>
      </div>
    </div>
    <slot></slot>
    <targetHandle v-if="showTargetHandle" handle-id="target" v-bind="props"></targetHandle>
    <sourceHandle v-if="showSourceHandle" handle-id="source" v-bind="props"></sourceHandle>
  </div>
</template>

<script setup lang="ts">
import { BlockEnum, type NodeProps } from '@/types/node';
import { computed } from 'vue';
import { NODE_PADDING_X, NODE_PADDING_Y } from './constant';
import nodeIcon from '../nodeIcon/index.vue';
import targetHandle from '../targetHandle/index.vue'
import sourceHandle from '../sourceHandle/index.vue'
const props = withDefaults(defineProps<NodeProps>(), {})

const showSelectedBorder = computed(() => props.data.selected || props.data._isBundled || props.data._isEntering)
const _style = computed(() => ({
  width: (props.data.type === BlockEnum.Loop) ? props.data.width : 'auto',
  height: (props.data.type === BlockEnum.Loop) ? props.data.height : 'auto',
  padding: `${NODE_PADDING_Y}px ${NODE_PADDING_X}px`,
}))
const _cls = computed(() => {
  return [
    showSelectedBorder.value ? 'border-red-3' : 'border-transparent'
  ]
})

const showSourceHandle = computed(() => ![BlockEnum.IfElse, BlockEnum.End].includes(props.data.type))
const showTargetHandle = computed(() => props.data.type !== BlockEnum.Start)
</script>

<style scoped>
</style>
