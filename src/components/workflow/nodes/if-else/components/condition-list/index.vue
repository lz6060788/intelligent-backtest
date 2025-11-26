<template>
  <div :class="cn('relative', !isSubVariable && 'pl-[60px]')">
    <template v-if="conditions.length > 1">
      <div
        :class="cn(
          'absolute bottom-0 left-0 top-0 w-[60px]',
          isSubVariable && logical_operator === LogicalOperator.and && 'left-[-10px]',
          isSubVariable && logical_operator === LogicalOperator.or && 'left-[-18px]',
        )"
      >
        <div class="absolute bottom-4 left-[46px] top-4 w-2.5 rounded-l-[8px] border border-r-0 border-gray-500 border-solid" />
        <div class="absolute right-0 top-1/2 h-[29px] w-4 -translate-y-1/2 bg-gray-800" />
        <div
          :class="cn(
            'absolute right-1 top-1/2 flex h-[21px] -translate-y-1/2 cursor-pointer select-none items-center rounded-md border-[0.5px] border-gray-500 bg-gray-600 px-1 text-[10px] font-semibold text-text-accent-secondary shadow-dark shadow-sm'
          )"
          @click="doToggleConditionLogicalOperator"
        >
          {{ logical_operator.toUpperCase() }}
          <RiLoopLeftLine class='ml-0.5 h-3 w-3 text-white' />
        </div>
      </div>
    </template>
    <ConditionItem
      v-for="condition in caseItem.conditions"
      :key="condition.id"
      :class="conditionItemClassName"
      :disabled="disabled"
      :case-id="caseId"
      :condition-id="isSubVariable ? conditionId! : condition.id"
      :condition="condition"
      :is-value-field-short="isValueFieldShort"
      @update-condition="(caseId: string, conditionId: string, condition: Condition) => emit('updateCondition', caseId, conditionId, condition)"
      @remove-condition="(caseId: string, conditionId: string) => emit('removeCondition', caseId, conditionId)"
      @add-sub-variable-condition="(caseId: string, conditionId: string, key?: string) => emit('addSubVariableCondition', caseId, conditionId, key)"
      @remove-sub-variable-condition="(caseId: string, conditionId: string, subConditionId: string) => emit('removeSubVariableCondition', caseId, conditionId, subConditionId)"
      @update-sub-variable-condition="(caseId: string, conditionId: string, subConditionId: string, newSubCondition: Condition) => emit('updateSubVariableCondition', caseId, conditionId, subConditionId, newSubCondition)"
      @toggle-sub-variable-condition-logical-operator="(caseId: string, conditionId: string) => emit('toggleSubVariableConditionLogicalOperator', caseId, conditionId)"
      :node-id="nodeId"
      :nodes-output-vars="nodesOutputVars"
      :available-nodes="availableNodes"
      :filter-var="filterVar"
      :number-variables="numberVariables"
      :file="varsIsVarFileAttribute[condition.id] ? { key: (condition.variable_selector || []).slice(-1)[0]! } : undefined"
      :is-sub-variable-key="isSubVariable"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  type CaseItem,
  type Condition,
  LogicalOperator,
} from '../../types'
import ConditionItem from './condition-item.vue'
import type {
  Node,
  NodeOutPutVar,
  Var,
} from '@/types'
import cn from '@/utils/classnames'
import { RiLoopLeftLine } from '@remixicon/vue'

/**
 * 条件列表组件的属性定义
 */
interface ConditionListProps {
  /** 是否为子变量 */
  isSubVariable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 案例ID */
  caseId: string
  /** 条件ID */
  conditionId?: string
  /** 案例项 */
  caseItem: CaseItem
  /** 节点ID */
  nodeId: string
  /** 节点输出变量列表 */
  nodesOutputVars: NodeOutPutVar[]
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 数字变量列表 */
  numberVariables: NodeOutPutVar[]
  /** 过滤变量的函数 */
  filterVar: (varPayload: Var) => boolean
  /** 变量是否为文件属性的映射 */
  varsIsVarFileAttribute: Record<string, boolean>
}

const emit = defineEmits<{
  (e: 'removeCondition', caseId: string, conditionId: string): void
  (e: 'updateCondition', caseId: string, conditionId: string, condition: Condition): void
  (e: 'toggleConditionLogicalOperator', caseId: string): void
  (e: 'addSubVariableCondition', caseId: string, conditionId: string, key?: string): void
  (e: 'removeSubVariableCondition', caseId: string, conditionId: string, subConditionId: string): void
  (e: 'updateSubVariableCondition', caseId: string, conditionId: string, subConditionId: string, newSubCondition: Condition): void
  (e: 'toggleSubVariableConditionLogicalOperator', caseId: string, conditionId: string): void
}>()

const props = defineProps<ConditionListProps>()

const { conditions, logical_operator } = props.caseItem

const doToggleConditionLogicalOperator = () => {
  if (props.isSubVariable)
    emit('toggleSubVariableConditionLogicalOperator', props.caseId!, props.conditionId!)
  else
    emit('toggleConditionLogicalOperator', props.caseId)
}

const isValueFieldShort = computed(() => {
  if (props.isSubVariable && conditions.length > 1)
    return true

  return false
})

const conditionItemClassName = computed(() => {
  if (!props.isSubVariable)
    return ''
  if (conditions.length < 2)
    return ''
  return logical_operator === LogicalOperator.and ? 'pl-[51px]' : 'pl-[42px]'
})
</script>

