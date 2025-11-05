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
      <div class="absolute bottom-4 left-[46px] top-4 w-2.5 rounded-l-[8px] border border-r-0 border-divider-deep"></div>
      <div class="absolute right-0 top-1/2 h-[29px] w-4 -translate-y-1/2 bg-components-panel-bg"></div>
      <div
        :class="cn(
          'absolute right-1 top-1/2 flex h-[21px] -translate-y-1/2 cursor-pointer select-none items-center rounded-md border-[0.5px] border-components-button-secondary-border bg-components-button-secondary-bg px-1 text-[10px] font-semibold text-text-accent-secondary shadow-xs'
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
      :on-update-condition="onUpdateCondition"
      :on-remove-condition="onRemoveCondition"
      :on-add-sub-variable-condition="onAddSubVariableCondition"
      :on-remove-sub-variable-condition="onRemoveSubVariableCondition"
      :on-update-sub-variable-condition="onUpdateSubVariableCondition"
      :on-toggle-sub-variable-condition-logical-operator="onToggleSubVariableConditionLogicalOperator"
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
  type HandleAddSubVariableCondition,
  type HandleRemoveCondition,
  type HandleToggleConditionLogicalOperator,
  type HandleToggleSubVariableConditionLogicalOperator,
  type HandleUpdateCondition,
  type HandleUpdateSubVariableCondition,
  LogicalOperator,
  type handleRemoveSubVariableCondition,
} from '../../type'
import ConditionItem from './condition-item.vue'
import type {
  Node,
  NodeOutPutVar,
} from '@/types/node'
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
  /** 删除条件回调 */
  onRemoveCondition?: HandleRemoveCondition
  /** 更新条件回调 */
  onUpdateCondition?: HandleUpdateCondition
  /** 切换条件逻辑操作符回调 */
  onToggleConditionLogicalOperator?: HandleToggleConditionLogicalOperator
  /** 节点ID */
  nodeId: string
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 数字变量列表 */
  numberVariables: NodeOutPutVar[]
  /** 添加子变量条件回调 */
  onAddSubVariableCondition?: HandleAddSubVariableCondition
  /** 删除子变量条件回调 */
  onRemoveSubVariableCondition?: handleRemoveSubVariableCondition
  /** 更新子变量条件回调 */
  onUpdateSubVariableCondition?: HandleUpdateSubVariableCondition
  /** 切换子变量条件逻辑操作符回调 */
  onToggleSubVariableConditionLogicalOperator?: HandleToggleSubVariableConditionLogicalOperator
  /** 可用变量列表 */
  availableVars: NodeOutPutVar[]
}

const props = defineProps<ConditionListProps>()

const doToggleConditionLogicalOperator = (conditionId?: string) => {
  if (props.isSubVariable && conditionId)
    props.onToggleSubVariableConditionLogicalOperator?.(conditionId)
  else
    props.onToggleConditionLogicalOperator?.()
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

