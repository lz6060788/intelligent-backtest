<template>
  <div :class="cn('mb-1 flex last-of-type:mb-0', className)">
    <div
      :class="cn(
        'grow rounded-lg bg-components-input-bg-normal',
        isHovered && 'bg-state-destructive-hover',
      )"
    >
      <div class="flex items-center p-1">
        <div class="w-0 grow">
          <template v-if="isSubVarSelect">
            <Select
              wrapper-class-name="h-6"
              class-name="pl-0 text-xs"
              option-wrap-class-name="w-[165px] max-h-none"
              :default-value="condition.key"
              :items="subVarOptions"
              :on-select="(item: any) => handleSubVarKeyChange(item.value as string)"
            >
              <template #trigger="{ item }">
                <div v-if="item" class="flex cursor-pointer justify-start">
                  <div class="inline-flex h-6 max-w-full items-center rounded-md border-[0.5px] border-components-panel-border-subtle bg-components-badge-white-to-dark px-1.5 text-text-accent shadow-xs">
                    <Variable02 class="h-3.5 w-3.5 shrink-0 text-text-accent" />
                    <div class="system-xs-medium ml-0.5 truncate">{{ item?.name }}</div>
                  </div>
                </div>
                <div v-else class="system-sm-regular text-left text-components-input-text-placeholder">{{ t('common.placeholder.select') }}</div>
              </template>
            </Select>
          </template>
          <template v-else>
            <ConditionVarSelector
              :open="open"
              @update:open="setOpen"
              :value-selector="condition.variable_selector || []"
              :var-type="condition.varType"
              :available-nodes="availableNodes"
              :nodes-output-vars="availableVars"
              @change="handleVarChange"
            />
          </template>
        </div>
        <div class="mx-1 h-3 w-[1px] bg-divider-regular"></div>
        <ConditionOperator
          :disabled="!canChooseOperator"
          :var-type="condition.varType"
          :value="condition.comparison_operator"
          :on-select="handleUpdateConditionOperator"
          :file="fileAttr"
        />
      </div>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && !isNotInput && condition.varType !== VarType.number && condition.varType !== VarType.boolean">
        <div class="max-h-[100px] overflow-y-auto border-t border-t-divider-subtle px-2 py-1">
          <ConditionInput
            :disabled="disabled"
            :value="condition.value as string"
            :on-change="handleUpdateConditionValue"
            :available-nodes="availableNodes"
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && condition.varType === VarType.boolean">
        <div class="p-1">
          <BoolValue
            :value="condition.value as boolean"
            :on-change="handleUpdateConditionValue"
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && !isNotInput && condition.varType === VarType.number">
        <div class="border-t border-t-divider-subtle px-2 py-1 pt-[3px]">
          <ConditionNumberInput
            :number-var-type="condition.numberVarType"
            :on-number-var-type-change="handleUpdateConditionNumberVarType"
            :value="condition.value as string"
            :on-value-change="handleUpdateConditionValue"
            :variables="numberVariables"
            :is-short="isValueFieldShort"
            :unit="fileAttr?.key === 'size' ? 'Byte' : undefined"
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && isSelect">
        <div class="border-t border-t-divider-subtle">
          <Select
            wrapper-class-name="h-8"
            class-name="rounded-t-none px-2 text-xs"
            :default-value="isArrayValue ? (condition.value as string[])?.[0] : (condition.value as string)"
            :items="selectOptions"
            :on-select="(item: any) => handleUpdateConditionValue(item.value as string)"
            hide-checked
            not-clearable
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && isSubVariable">
        <div class="p-1">
          <ConditionWrap
            :is-sub-variable="true"
            :conditions="condition.sub_variable_condition?.conditions || []"
            :logical-operator="condition.sub_variable_condition?.logical_operator"
            :condition-id="conditionId"
            :read-only="!!disabled"
            :handle-add-sub-variable-condition="onAddSubVariableCondition"
            :handle-remove-sub-variable-condition="onRemoveSubVariableCondition"
            :handle-update-sub-variable-condition="onUpdateSubVariableCondition"
            :handle-toggle-sub-variable-condition-logical-operator="onToggleSubVariableConditionLogicalOperator"
            :node-id="nodeId"
            :available-nodes="availableNodes"
            :available-vars="availableVars"
          />
        </div>
      </template>
    </div>
    <div
      class="ml-1 mt-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-tertiary hover:bg-state-destructive-hover hover:text-text-destructive"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="doRemoveCondition"
    >
      <RiDeleteBinLine class="h-4 w-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiDeleteBinLine } from '@remixicon/vue'
import { produce } from 'immer'
import { ValueType as NumberVarType } from '@/types'
import type {
  Condition,
  HandleAddSubVariableCondition,
  HandleRemoveCondition,
  HandleToggleSubVariableConditionLogicalOperator,
  HandleUpdateCondition,
  HandleUpdateSubVariableCondition,
  handleRemoveSubVariableCondition,
} from '../../type'
import {
  ComparisonOperator,
} from '../../type'
import ConditionNumberInput from '../condition-number-input.vue'
import ConditionWrap from '../condition-wrap.vue'
import { comparisonOperatorNotRequireValue, getOperators } from '../../utils'
import ConditionOperator from './condition-operator.vue'
import ConditionInput from './condition-input.vue'
import { FILE_TYPE_OPTIONS, SUB_VARIABLES, TRANSFER_METHOD } from '../../default'
import type {
  Node,
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types/node'
import { VarType } from '@/types'
import cn from '@/utils/classnames'
import { SimpleSelect as Select } from '@/components/base/select.vue'
import { Variable02 } from '@remixicon/vue'
import ConditionVarSelector from './condition-var-selector.vue'
import BoolValue from '@/components/workflow/panel/chat-variable-panel/components/bool-value.vue'

const optionNameI18NPrefix = 'workflow.nodes.ifElse.optionName'

/**
 * 条件项组件的属性定义
 */
interface ConditionItemProps {
  /** 类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 条件ID */
  conditionId: string
  /** 条件对象 */
  condition: Condition
  /** 文件对象 */
  file?: { key: string }
  /** 是否为子变量键 */
  isSubVariableKey?: boolean
  /** 值字段是否短 */
  isValueFieldShort?: boolean
  /** 删除条件回调 */
  onRemoveCondition?: HandleRemoveCondition
  /** 更新条件回调 */
  onUpdateCondition?: HandleUpdateCondition
  /** 添加子变量条件回调 */
  onAddSubVariableCondition?: HandleAddSubVariableCondition
  /** 删除子变量条件回调 */
  onRemoveSubVariableCondition?: handleRemoveSubVariableCondition
  /** 更新子变量条件回调 */
  onUpdateSubVariableCondition?: HandleUpdateSubVariableCondition
  /** 切换子变量条件逻辑操作符回调 */
  onToggleSubVariableConditionLogicalOperator?: HandleToggleSubVariableConditionLogicalOperator
  /** 节点ID */
  nodeId: string
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 数字变量列表 */
  numberVariables: NodeOutPutVar[]
  /** 可用变量列表 */
  availableVars: NodeOutPutVar[]
}

const props = defineProps<ConditionItemProps>()

const { t } = useI18n()

const isHovered = ref(false)
const open = ref(false)

const doUpdateCondition = (newCondition: Condition) => {
  if (props.isSubVariableKey)
    props.onUpdateSubVariableCondition?.(props.conditionId, props.condition.id, newCondition)
  else
    props.onUpdateCondition?.(props.condition.id, newCondition)
}

const canChooseOperator = computed(() => {
  if (props.disabled)
    return false

  if (props.isSubVariableKey)
    return !!props.condition.key

  return true
})

const handleUpdateConditionOperator = (value: ComparisonOperator) => {
  const newCondition = {
    ...props.condition,
    comparison_operator: value,
  }
  doUpdateCondition(newCondition)
}

const handleUpdateConditionNumberVarType = (numberVarType: NumberVarType) => {
  const newCondition = {
    ...props.condition,
    numberVarType,
    value: '',
  }
  doUpdateCondition(newCondition)
}

const isSubVariable = computed(() => {
  return props.condition.varType === VarType.arrayFile && [ComparisonOperator.contains, ComparisonOperator.notContains, ComparisonOperator.allOf].includes(props.condition.comparison_operator!)
})

const fileAttr = computed(() => {
  if (props.file)
    return props.file
  if (props.isSubVariableKey) {
    return {
      key: props.condition.key!,
    }
  }
  return undefined
})

const isArrayValue = computed(() => fileAttr.value?.key === 'transfer_method' || fileAttr.value?.key === 'type')

const handleUpdateConditionValue = (value: string | boolean) => {
  if (value === props.condition.value || (isArrayValue.value && value === (props.condition.value as string[])?.[0]))
    return
  const newCondition = {
    ...props.condition,
    value: isArrayValue.value ? [value as string] : value,
  }
  doUpdateCondition(newCondition)
}

const isSelect = computed(() => props.condition.comparison_operator && [ComparisonOperator.in, ComparisonOperator.notIn].includes(props.condition.comparison_operator))

const selectOptions = computed(() => {
  if (isSelect.value) {
    if (fileAttr.value?.key === 'type' || props.condition.comparison_operator === ComparisonOperator.allOf) {
      return FILE_TYPE_OPTIONS.map(item => ({
        name: t(`${optionNameI18NPrefix}.${item.i18nKey}`),
        value: item.value,
      }))
    }
    if (fileAttr.value?.key === 'transfer_method') {
      return TRANSFER_METHOD.map(item => ({
        name: t(`${optionNameI18NPrefix}.${item.i18nKey}`),
        value: item.value,
      }))
    }
    return []
  }
  return []
})

const isNotInput = computed(() => isSelect.value || isSubVariable.value)

const isSubVarSelect = computed(() => props.isSubVariableKey)

const subVarOptions = computed(() => SUB_VARIABLES.map(item => ({
  name: item,
  value: item,
})))

const handleSubVarKeyChange = (key: string) => {
  const newCondition = produce(props.condition, (draft) => {
    draft.key = key
    if (key === 'size')
      draft.varType = VarType.number
    else
      draft.varType = VarType.string

    draft.value = ''
    draft.comparison_operator = getOperators(undefined, { key })[0]
  })

  props.onUpdateSubVariableCondition?.(props.conditionId, props.condition.id, newCondition)
}

const doRemoveCondition = () => {
  if (props.isSubVariableKey)
    props.onRemoveSubVariableCondition?.(props.conditionId, props.condition.id)
  else
    props.onRemoveCondition?.(props.condition.id)
}

const handleVarChange = (valueSelector: ValueSelector, varItem: Var) => {
  const newCondition = produce(props.condition, (draft) => {
    draft.variable_selector = valueSelector
    draft.varType = varItem.type
    draft.value = ''
    draft.comparison_operator = getOperators(varItem.type)[0]
    delete draft.key
    delete draft.sub_variable_condition
    delete draft.numberVarType
  })
  doUpdateCondition(newCondition)
  open.value = false
}

const setOpen = (value: boolean) => {
  open.value = value
}
</script>

