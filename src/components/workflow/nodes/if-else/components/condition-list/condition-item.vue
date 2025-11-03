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
              class="pl-0 text-xs"
              option-wrap-class-name="w-[165px] max-h-none"
              :default-value="condition.key"
              :items="subVarOptions"
              :on-select="(item: any) => handleSubVarKeyChange(item.value as string)"
              hide-checked
            >
              <template #trigger="{ item }">
                <div
                  v-if="item"
                  class="flex cursor-pointer justify-start"
                >
                  <div class="inline-flex h-6 max-w-full items-center rounded-md border-[0.5px] border-components-panel-border-subtle bg-components-badge-white-to-dark px-1.5 text-text-accent shadow-xs">
                    <i class="i-ri-variable-line h-3.5 w-3.5 shrink-0 text-text-accent" />
                    <div class="system-xs-medium ml-0.5 truncate">{{ item?.name }}</div>
                  </div>
                </div>
                <div
                  v-else
                  class="system-sm-regular text-left text-components-input-text-placeholder"
                >
                  {{ t('common.placeholder.select') }}
                </div>
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
              :nodes-output-vars="nodesOutputVars"
              @change="handleVarChange"
            />
          </template>
        </div>
        <div class="mx-1 h-3 w-[1px] bg-divider-regular" />
        <ConditionOperator
          :disabled="!canChooseOperator"
          :var-type="condition.varType"
          :value="condition.comparison_operator"
          :on-select="handleUpdateConditionOperator"
          :file="fileAttr"
        />
      </div>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && !isNotInput && condition.varType !== VarType.number && !showBooleanInput">
        <div class="max-h-[100px] overflow-y-auto border-t border-t-divider-subtle px-2 py-1">
          <ConditionInput
            :disabled="disabled"
            :value="condition.value as string"
            :on-change="handleUpdateConditionValue"
            :nodes-output-vars="nodesOutputVars"
            :available-nodes="availableNodes"
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && !isNotInput && showBooleanInput">
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
            :number-var-type="condition.numberVarType!"
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
            class="rounded-t-none px-2 text-xs"
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
            :case-id="caseId"
            :condition-id="conditionId"
            :read-only="!!disabled"
            :cases="condition.sub_variable_condition ? [condition.sub_variable_condition] : []"
            :handle-add-sub-variable-condition="onAddSubVariableCondition"
            :handle-remove-sub-variable-condition="onRemoveSubVariableCondition"
            :handle-update-sub-variable-condition="onUpdateSubVariableCondition"
            :handle-toggle-sub-variable-condition-logical-operator="onToggleSubVariableConditionLogicalOperator"
            :node-id="nodeId"
            :nodes-output-vars="nodesOutputVars"
            :available-nodes="availableNodes"
            :filter-var="filterVar"
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
      <i class="i-ri-delete-bin-line h-4 w-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
} from '../../types'
import {
  ComparisonOperator,
} from '../../types'
import { comparisonOperatorNotRequireValue, getOperators } from '../../utils'
import ConditionNumberInput from '../condition-number-input.vue'
import { FILE_TYPE_OPTIONS, SUB_VARIABLES, TRANSFER_METHOD } from '../../../constants'
import ConditionWrap from '../condition-wrap.vue'
import ConditionOperator from './condition-operator.vue'
import ConditionInput from './condition-input.vue'
import { useWorkflowStore } from '@/components/workflow/store'
import ConditionVarSelector from './condition-var-selector.vue'
import type {
  Node,
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types'
import { VarType } from '@/types'
import cn from '@/utils/classnames'
import { SimpleSelect as Select } from '@/components/base/select'
import BoolValue from '@/components/workflow/panel/chat-variable-panel/components/bool-value'
import { getVarType } from '@/components/workflow/nodes/_base/variable/utils'
import { useIsChatMode } from '@/components/workflow/hooks/use-workflow'
import useMatchSchemaType from '../../../_base/components/variable/use-match-schema-type'
import {
  useAllBuiltInTools,
  useAllCustomTools,
  useAllMCPTools,
  useAllWorkflowTools,
} from '@/service/use-tools'

const optionNameI18NPrefix = 'workflow.nodes.ifElse.optionName'

/**
 * 条件项组件的属性定义
 */
interface ConditionItemProps {
  /** 自定义样式类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 案例ID */
  caseId: string
  /** 条件ID（在 isSubVariableKey 中，它是父条件的 id 值） */
  conditionId: string
  /** 条件对象（可能是案例的条件或子变量的条件） */
  condition: Condition
  /** 文件属性 */
  file?: { key: string }
  /** 是否为子变量键 */
  isSubVariableKey?: boolean
  /** 值字段是否短 */
  isValueFieldShort?: boolean
  /** 删除条件的回调 */
  onRemoveCondition?: HandleRemoveCondition
  /** 更新条件的回调 */
  onUpdateCondition?: HandleUpdateCondition
  /** 添加子变量条件的回调 */
  onAddSubVariableCondition?: HandleAddSubVariableCondition
  /** 删除子变量条件的回调 */
  onRemoveSubVariableCondition?: handleRemoveSubVariableCondition
  /** 更新子变量条件的回调 */
  onUpdateSubVariableCondition?: HandleUpdateSubVariableCondition
  /** 切换子变量条件逻辑操作符的回调 */
  onToggleSubVariableConditionLogicalOperator?: HandleToggleSubVariableConditionLogicalOperator
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
}

const props = defineProps<ConditionItemProps>()

const { t } = useI18n()
const isChatMode = useIsChatMode()
const isHovered = ref(false)
const open = ref(false)

const { data: buildInTools } = useAllBuiltInTools()
const { data: customTools } = useAllCustomTools()
const { data: workflowTools } = useAllWorkflowTools()
const { data: mcpTools } = useAllMCPTools()

const workflowStore = useWorkflowStore()

const doUpdateCondition = (newCondition: Condition) => {
  if (props.isSubVariableKey)
    props.onUpdateSubVariableCondition?.(props.caseId, props.conditionId, props.condition.id, newCondition)
  else
    props.onUpdateCondition?.(props.caseId, props.condition.id, newCondition)
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

const isSubVariable = computed(() => 
  props.condition.varType === VarType.arrayFile && 
  [ComparisonOperator.contains, ComparisonOperator.notContains, ComparisonOperator.allOf].includes(props.condition.comparison_operator!)
)

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

const isArrayValue = computed(() => 
  fileAttr.value?.key === 'transfer_method' || fileAttr.value?.key === 'type'
)

const handleUpdateConditionValue = (value: string | boolean) => {
  if (value === props.condition.value || (isArrayValue.value && value === (props.condition.value as string[])?.[0]))
    return
  const newCondition = {
    ...props.condition,
    value: isArrayValue.value ? [value as string] : value,
  }
  doUpdateCondition(newCondition)
}

const isSelect = computed(() => 
  props.condition.comparison_operator && 
  [ComparisonOperator.in, ComparisonOperator.notIn].includes(props.condition.comparison_operator)
)

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

  props.onUpdateSubVariableCondition?.(props.caseId, props.conditionId, props.condition.id, newCondition)
}

const doRemoveCondition = () => {
  if (props.isSubVariableKey)
    props.onRemoveSubVariableCondition?.(props.caseId, props.conditionId, props.condition.id)
  else
    props.onRemoveCondition?.(props.caseId, props.condition.id)
}

const { schemaTypeDefinitions } = useMatchSchemaType()

const handleVarChange = (valueSelector: ValueSelector, _varItem: Var) => {
  const resolvedVarType = getVarType({
    valueSelector,
    conversationVariables: workflowStore.conversationVariables,
    availableNodes: props.availableNodes,
    isChatMode: isChatMode.value,
    allPluginInfoList: {
      buildInTools: buildInTools.value || [],
      customTools: customTools.value || [],
      mcpTools: mcpTools.value || [],
      workflowTools: workflowTools.value || [],
      dataSourceList: workflowStore.dataSourceList || [],
    },
    schemaTypeDefinitions: schemaTypeDefinitions.value,
  })

  const newCondition = produce(props.condition, (draft) => {
    draft.variable_selector = valueSelector
    draft.varType = resolvedVarType
    draft.value = resolvedVarType === VarType.boolean ? false : ''
    draft.comparison_operator = getOperators(resolvedVarType)[0]
    delete draft.key
    delete draft.sub_variable_condition
    delete draft.numberVarType
    setTimeout(() => workflowStore.setControlPromptEditorRerenderKey?.(Date.now()))
  })
  doUpdateCondition(newCondition)
  open.value = false
}

const showBooleanInput = computed(() => {
  if (props.condition.varType === VarType.boolean)
    return true

  if (props.condition.varType === VarType.arrayBoolean && 
      [ComparisonOperator.contains, ComparisonOperator.notContains].includes(props.condition.comparison_operator!))
    return true
  return false
})

const setOpen = (value: boolean) => {
  open.value = value
}
</script>

