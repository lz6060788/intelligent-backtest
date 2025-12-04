<template>
  <div :class="cn('relative', conditions.length > 1 && !isSubVariable && 'pl-[60px]')">
    <div
      v-if="conditions.length > 1"
      :class="cn(
        'absolute bottom-0 left-0 top-0 w-[60px]',
        isSubVariable && logicalOperator === LogicalOperator.and && 'left-[-10px]',
        isSubVariable && logicalOperator === LogicalOperator.or && 'left-[-18px]',
      )"
    >
      <div class="absolute bottom-4 left-[46px] top-4 w-2.5 rounded-l-[8px] border border-r-0 border-solid border-gray-500"></div>
      <div class="absolute right-0 top-1/2 h-[29px] w-4 -translate-y-1/2 bg-components-panel-bg"></div>
      <div
        :class="cn(
          'absolute right-1 top-1/2 flex h-[21px] -translate-y-1/2 cursor-pointer select-none items-center rounded-md border-[0.5px] border-solid \
          border-gray-500 bg-gray-700 hover:bg-gray-600 px-1 text-[10px] font-semibold text-text-accent-secondary shadow-xs'
        )"
        @click="doToggleConditionLogicalOperator(conditionId)"
      >
        {{ logicalOperator && logicalOperator.toUpperCase() }}
        <RiLoopLeftLine class="ml-0.5 h-3 w-3" />
      </div>
    </div>
    <ConditionItem
      v-for="condition in conditions"
      :key="condition.id"
      :class="conditionItemClassName"
      :disabled="disabled"
      :condition-id="isSubVariable ? conditionId! : condition.id"
      :condition="condition"
      :is-value-field-short="isValueFieldShort"
      @update-condition="(conditionId: string, newCondition: Condition) => emit('update-condition', conditionId, newCondition)"
      @remove-condition="(conditionId: string) => emit('remove-condition', conditionId)"
      @add-sub-variable-condition="(conditionId: string, key?: string) => emit('add-sub-variable-condition', conditionId, key)"
      @remove-sub-variable-condition="(conditionId: string, subConditionId: string) => emit('remove-sub-variable-condition', conditionId, subConditionId)"
      @update-sub-variable-condition="(conditionId: string, subConditionId: string, newSubCondition: Condition) => emit('update-sub-variable-condition', conditionId, subConditionId, newSubCondition)"
      @toggle-sub-variable-condition-logical-operator="(conditionId: string) => emit('toggle-sub-variable-condition-logical-operator', conditionId)"
      :node-id="nodeId"
      :available-nodes="availableNodes"
      :number-variables="numberVariables"
      :is-sub-variable-key="isSubVariable"
      :available-vars="availableVars"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RiLoopLeftLine } from '@remixicon/vue'
import {
  type Condition,
  LogicalOperator,
} from '../../type'
import ConditionItem from './condition-item.vue'
import type {
  Node,
  NodeOutPutVar,
} from '@/types'
import cn from '@/utils/classnames'

/**
 * 条件列表组件的属性定义
 */
interface ConditionListProps {
  /** 是否为子变量 */
  isSubVariable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 条件ID */
  conditionId?: string
  /** 条件列表 */
  conditions: Condition[]
  /** 逻辑操作符 */
  logicalOperator?: LogicalOperator
  /** 节点ID */
  nodeId: string
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 数字变量列表 */
  numberVariables: NodeOutPutVar[]
  /** 可用变量列表 */
  availableVars: NodeOutPutVar[]
}

const props = defineProps<ConditionListProps>()
const emit = defineEmits<{
  (e: 'update-condition', conditionId: string, newCondition: Condition): void
  (e: 'remove-condition', conditionId: string): void
  (e: 'toggle-condition-logical-operator'): void
  (e: 'add-sub-variable-condition', conditionId: string, key?: string): void
  (e: 'remove-sub-variable-condition', conditionId: string, subConditionId: string): void
  (e: 'update-sub-variable-condition', conditionId: string, subConditionId: string, newSubCondition: Condition): void
  (e: 'toggle-sub-variable-condition-logical-operator', conditionId: string): void
}>()

const doToggleConditionLogicalOperator = (conditionId?: string) => {
  if (props.isSubVariable && conditionId)
    emit('toggle-sub-variable-condition-logical-operator', conditionId)
  else
    emit('toggle-condition-logical-operator')
}

const isValueFieldShort = computed(() => {
  if (props.isSubVariable && props.conditions.length > 1)
    return true

  return false
})

const conditionItemClassName = computed(() => {
  if (!props.isSubVariable)
    return ''
  if (props.conditions.length < 2)
    return ''
  return props.logicalOperator === LogicalOperator.and ? 'pl-[51px]' : 'pl-[42px]'
})
</script>

