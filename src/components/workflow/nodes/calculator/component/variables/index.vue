<template>
  <Empty v-if="!variables.length" />
  <template v-else>
    <Item
      v-for="variable in variables"
      :key="variable.id"
      :item="variable"
      :node-id="nodeId"
      :is-fixed="isFixed"
      :arguments-template="argumentsTemplate"
      @remove-variable="handleRemoveVariable"
      @update-variable="handleUpdateVariable"
    />
  </template>
</template>

<script setup lang="ts">
import Empty from './empty.vue'
import Item from './item.vue'
import type {
  CalculatorVariable,
} from '../../types'
import type { CalculatorArgument } from '../../types'

interface Props {
  nodeId: string;
  isFixed: boolean;
  argumentsTemplate: CalculatorArgument[];
  /** 变量列表 */
  variables?: CalculatorVariable[]
}


const props = withDefaults(defineProps<Props>(), {
  variables: () => [],
})

const emit = defineEmits<{
  (e: 'remove-variable', id: string): void
  (e: 'update-variable', id: string, updateData: Partial<CalculatorVariable>): void
}>()

const handleRemoveVariable = (id: string) => {
  emit('remove-variable', id)
}

const handleUpdateVariable = (id: string, updateData: Partial<CalculatorVariable>) => {
  emit('update-variable', id, updateData)
}
</script>

