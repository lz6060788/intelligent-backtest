<template>
  <Empty v-if="!variables.length" />
  <Item
    v-for="variable in variables"
    v-else
    :key="variable.id"
    :item="variable"
    :node-id="nodeId"
    :handle-remove-loop-variable="handleRemoveLoopVariable"
    :handle-update-loop-variable="handleUpdateLoopVariable"
  />
</template>

<script setup lang="ts">
import Empty from './empty.vue'
import Item from './item.vue'
import type {
  LoopVariable,
  LoopVariablesComponentShape,
} from '@/components/workflow/nodes/loop/type'

/**
 * 循环变量组件属性定义
 */
interface LoopVariableProps {
  /** 变量列表 */
  variables?: LoopVariable[]
} & LoopVariablesComponentShape

const props = withDefaults(defineProps<LoopVariableProps>(), {
  variables: () => [],
})
</script>

