<template>
  <Empty v-if="!variables.length" />
  <template v-else>
    <Item
      v-for="variable in variables"
      :key="variable.id"
      :item="variable"
      :node-id="nodeId"
      @remove-loop-variable="handleRemoveLoopVariable"
      @update-loop-variable="handleUpdateLoopVariable"
    />
  </template>
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
interface LoopVariableProps extends LoopVariablesComponentShape {
  /** 变量列表 */
  variables?: LoopVariable[]
}

const props = withDefaults(defineProps<LoopVariableProps>(), {
  variables: () => [],
})

const emit = defineEmits<{
  (e: 'remove-loop-variable', id: string): void
  (e: 'update-loop-variable', id: string, updateData: Partial<LoopVariable>): void
}>()

const handleRemoveLoopVariable = (id: string) => {
  emit('remove-loop-variable', id)
}

const handleUpdateLoopVariable = (id: string, updateData: Partial<LoopVariable>) => {
  emit('update-loop-variable', id, updateData)
}
</script>

