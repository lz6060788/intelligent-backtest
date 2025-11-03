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
        <div class="absolute bottom-4 left-[46px] top-4 w-2.5 rounded-l-[8px] border border-r-0 border-divider-deep" />
        <div class="absolute right-0 top-1/2 h-[29px] w-4 -translate-y-1/2 bg-components-panel-bg" />
        <div
          :class="cn(
            'absolute right-1 top-1/2 flex h-[21px] -translate-y-1/2 cursor-pointer select-none items-center rounded-md border-[0.5px] border-components-button-secondary-border bg-components-button-secondary-bg px-1 text-[10px] font-semibold text-text-accent-secondary shadow-xs'
          )"
          @click="doToggleConditionLogicalOperator"
        >
          {{ logical_operator.toUpperCase() }}
          <i class="i-ri-loop-left-line ml-0.5 h-3 w-3" />
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
      :on-update-condition="onUpdateCondition"
      :on-remove-condition="onRemoveCondition"
      :on-add-sub-variable-condition="onAddSubVariableCondition"
      :on-remove-sub-variable-condition="onRemoveSubVariableCondition"
      :on-update-sub-variable-condition="onUpdateSubVariableCondition"
      :on-toggle-sub-variable-condition-logical-operator="onToggleSubVariableConditionLogicalOperator"
      :node-id="nodeId"
      :nodes-output-vars="nodesOutputVars"
      :available-nodes="availableNodes"
      :filter-var="filterVar"
      :number-variables="numberVariables"
      :file="varsIsVarFileAttribute[condition.id] ? { key: (condition.variable_selector || []).slice(-1)[0] } : undefined"
      :is-sub-variable-key="isSubVariable"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  type CaseItem,
  type HandleAddSubVariableCondition,
  type HandleRemoveCondition,
  type HandleToggleConditionLogicalOperator,
  type HandleToggleSubVariableConditionLogicalOperator,
  type HandleUpdateCondition,
  type HandleUpdateSubVariableCondition,
  LogicalOperator,
  type handleRemoveSubVariableCondition,
} from '../../types'
import ConditionItem from './condition-item.vue'
import type {
  Node,
  NodeOutPutVar,
  Var,
} from '@/app/components/workflow/types'
import cn from '@/utils/classnames'

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
  /** 删除条件的回调 */
  onRemoveCondition?: HandleRemoveCondition
  /** 更新条件的回调 */
  onUpdateCondition?: HandleUpdateCondition
  /** 切换条件逻辑操作符的回调 */
  onToggleConditionLogicalOperator?: HandleToggleConditionLogicalOperator
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
  /** 添加子变量条件的回调 */
  onAddSubVariableCondition?: HandleAddSubVariableCondition
  /** 删除子变量条件的回调 */
  onRemoveSubVariableCondition?: handleRemoveSubVariableCondition
  /** 更新子变量条件的回调 */
  onUpdateSubVariableCondition?: HandleUpdateSubVariableCondition
  /** 切换子变量条件逻辑操作符的回调 */
  onToggleSubVariableConditionLogicalOperator?: HandleToggleSubVariableConditionLogicalOperator
}

const props = defineProps<ConditionListProps>()

const { conditions, logical_operator } = props.caseItem

const doToggleConditionLogicalOperator = () => {
  if (props.isSubVariable)
    props.onToggleSubVariableConditionLogicalOperator?.(props.caseId!, props.conditionId!)
  else
    props.onToggleConditionLogicalOperator?.(props.caseId)
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

