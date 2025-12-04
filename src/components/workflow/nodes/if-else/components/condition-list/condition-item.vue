<template>
  <div :class="cn('mb-1 flex last-of-type:mb-0', className)">
    <div
      :class="cn(
        'grow rounded-lg bg-gray-700',
        isHovered && 'bg-[#4b1515]',
      )"
    >
      <div class="flex items-center p-1">
        <div class="w-0 grow">
          <template v-if="isSubVarSelect">
            <el-select
              :model-value="condition.key"
              @change="(value: string) => handleSubVarKeyChange(value)"
              :placeholder="t('common.placeholder.select')"
              class="pl-0 text-xs"
              size="small"
              :popper-class="cn('popper-default', 'w-[165px]')"
              :teleported="false"
              :persistent="false"
              :show-arrow="false"
              :offset="4"
              :popper-style="{ zIndex: 1000 }"
            >
              <el-option
                v-for="item in subVarOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
            <!-- <Select
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
                  v-if="condition.key"
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
            </Select> -->
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
          @select="handleUpdateConditionOperator"
          :file="fileAttr"
        />
      </div>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && !isNotInput && condition.varType !== VarType.number && !showBooleanInput">
        <div class="max-h-[100px] overflow-y-auto border-0 border-t border-gray-600 border-solid px-2 py-1">
          <ConditionInput
            :disabled="disabled"
            :value="condition.value as string"
            @change="handleUpdateConditionValue"
            :nodes-output-vars="nodesOutputVars"
            :available-nodes="availableNodes"
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && !isNotInput && showBooleanInput">
        <div class="p-1">
          <el-switch
            :model-value="condition.value as boolean"
            @change="(value: boolean) => handleUpdateConditionValue(value)"
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && !isNotInput && condition.varType === VarType.number">
        <div class="border-0 border-t border-solid border-gray-600 px-2 p-1 pt-[3px]">
          <ConditionNumberInput
            :number-var-type="condition.numberVarType!"
            @number-var-type-change="handleUpdateConditionNumberVarType"
            :value="condition.value as string"
            @value-change="handleUpdateConditionValue"
            :variables="numberVariables"
            :is-short="isValueFieldShort"
            :unit="fileAttr?.key === 'size' ? 'Byte' : undefined"
          />
        </div>
      </template>
      <template v-if="!comparisonOperatorNotRequireValue(condition.comparison_operator) && isSelect">
        <div class="border-0 border-t border-solid border-gray-600 p-1">
          <el-select
            :model-value="isArrayValue ? (condition.value as string[])?.[0] : (condition.value as string)"
            @change="(value: string) => handleUpdateConditionValue(value)"
            size="small"
            :popper-class="cn('popper-default', 'w-[165px]')"
            :teleported="false"
            :persistent="false"
            :show-arrow="false"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
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
            @add-sub-variable-condition="(caseId: string, conditionId: string, key?: string) => emit('addSubVariableCondition', caseId, conditionId, key)"
            @remove-sub-variable-condition="(caseId: string, conditionId: string, subConditionId: string) => emit('removeSubVariableCondition', caseId, conditionId, subConditionId)"
            @update-sub-variable-condition="(caseId: string, conditionId: string, subConditionId: string, newSubCondition: Condition) => emit('updateSubVariableCondition', caseId, conditionId, subConditionId, newSubCondition)"
            @toggle-sub-variable-condition-logical-operator="(caseId: string, conditionId: string) => emit('toggleSubVariableConditionLogicalOperator', caseId, conditionId)"
            :node-id="nodeId"
            :nodes-output-vars="nodesOutputVars"
            :available-nodes="availableNodes"
            :filter-var="filterVar"
          />
        </div>
      </template>
    </div>
    <div
      class="ml-1 mt-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-tertiary hover:bg-red-500 hover:text-white"
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
import { produce } from 'immer'
import type { VarType as NumberVarType } from '@/components/workflow/nodes/tool/types'
import type {
  Condition,
} from '../../types'
import {
  ComparisonOperator,
} from '../../types'
import { comparisonOperatorNotRequireValue, getOperators } from '../../utils'
import ConditionNumberInput from '../condition-number-input.vue'
import { FILE_TYPE_OPTIONS, SUB_VARIABLES, TRANSFER_METHOD } from '@/components/workflow/constant/nodes'
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
import { RiDeleteBinLine } from '@remixicon/vue'
// import BoolValue from '@/components/workflow/panel/chat-variable-panel/components/bool-value'
import { getVarType } from '@/components/workflow/nodes/_base/variable/utils'
// import { useIsChatMode } from '@/components/workflow/hooks/use-workflow'
// import useMatchSchemaType from '../../../_base/components/variable/use-match-schema-type'
// import {
//   useAllBuiltInTools,
//   useAllCustomTools,
//   useAllMCPTools,
//   useAllWorkflowTools,
// } from '@/service/use-tools'

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

const emit = defineEmits<{
  (e: 'removeCondition', caseId: string, conditionId: string): void
  (e: 'updateCondition', caseId: string, conditionId: string, condition: Condition): void
  (e: 'addSubVariableCondition', caseId: string, conditionId: string, key?: string): void
  (e: 'removeSubVariableCondition', caseId: string, conditionId: string, subConditionId: string): void
  (e: 'updateSubVariableCondition', caseId: string, conditionId: string, subConditionId: string, newSubCondition: Condition): void
  (e: 'toggleSubVariableConditionLogicalOperator', caseId: string, conditionId: string): void
}>()

const props = defineProps<ConditionItemProps>()

const { t } = useI18n()
const isChatMode = ref(false)
const isHovered = ref(false)
const open = ref(false)

// const { data: buildInTools } = useAllBuiltInTools()
// const { data: customTools } = useAllCustomTools()
// const { data: workflowTools } = useAllWorkflowTools()
// const { data: mcpTools } = useAllMCPTools()

const buildInTools = ref([])
const customTools = ref([])
const workflowTools = ref([])
const mcpTools = ref([])

const workflowStore = useWorkflowStore()

const doUpdateCondition = (newCondition: Condition) => {
  if (props.isSubVariableKey)
    emit('updateSubVariableCondition', props.caseId, props.conditionId, props.condition.id, newCondition)
  else
    emit('updateCondition', props.caseId, props.condition.id, newCondition)
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
    numberVarType: numberVarType,
    value: '',
  } as Condition
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

  emit('updateSubVariableCondition', props.caseId, props.conditionId, props.condition.id, newCondition)
}

const doRemoveCondition = () => {
  if (props.isSubVariableKey)
    emit('removeSubVariableCondition', props.caseId, props.conditionId, props.condition.id)
  else
    emit('removeCondition', props.caseId, props.condition.id)
}

// const { schemaTypeDefinitions } = useMatchSchemaType()

const handleVarChange = (valueSelector: ValueSelector, _varItem: Var) => {
  const resolvedVarType = getVarType({
    valueSelector,
    conversationVariables: [],
    availableNodes: props.availableNodes,
    isChatMode: isChatMode.value,
    allPluginInfoList: {
      buildInTools: buildInTools.value || [],
      customTools: customTools.value || [],
      mcpTools: mcpTools.value || [],
      workflowTools: workflowTools.value || [],
      dataSourceList: [],
    },
    // schemaTypeDefinitions: schemaTypeDefinitions.value,
  })

  const newCondition = produce(props.condition, (draft) => {
    draft.variable_selector = valueSelector
    draft.varType = resolvedVarType
    draft.value = resolvedVarType === VarType.boolean ? false : ''
    draft.comparison_operator = getOperators(resolvedVarType)[0]
    delete draft.key
    delete draft.sub_variable_condition
    delete draft.numberVarType
    // setTimeout(() => workflowStore.setControlPromptEditorRerenderKey?.(Date.now()))
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

