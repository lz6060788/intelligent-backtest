<template>
  <div class="flex h-6 items-center rounded-md bg-gray-700 px-1">
    <VariableLabelInText
      class="w-0 grow"
      :variables="variableSelector"
      :node-title="node?.data!.title"
      :node-type="node?.data!.type"
      :is-exception-variable="isException"
      :not-show-full-path="true"
    />
    <div
      class="mx-1 shrink-0 text-xs font-medium text-text-primary"
      :title="operatorName"
    >
      {{ operatorName }}
    </div>
    <template v-if="!notHasValue">
      <div class="shrink-[3] truncate text-xs text-text-secondary" :title="formatValue">
        {{ isSelect ? selectName : formatValue }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVueFlow } from '@vue-flow/core'
import { ComparisonOperator } from '../types'
import {
  comparisonOperatorNotRequireValue,
  isComparisonOperatorNeedTranslate,
} from '../utils'
import { FILE_TYPE_OPTIONS, TRANSFER_METHOD } from '@/components/workflow/constant'
import { isSystemVar } from '@/components/workflow/nodes/_base/variable/utils'
import { isExceptionVariable } from '@/components/workflow/utils'
import type {
  CommonNodeType,
  Node,
} from '@/types'
import {
  VariableLabelInText,
} from '@/components/workflow/nodes/_base/variable/variable-label'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'

/**
 * 条件值组件的属性定义
 */
interface ConditionValueProps {
  /** 变量选择器 */
  variableSelector: string[]
  /** 标签名称 */
  labelName?: string
  /** 比较操作符 */
  operator: ComparisonOperator
  /** 值 */
  value: string | string[] | boolean
}

const props = defineProps<ConditionValueProps>()

const { t } = useI18n()
const { instanceId } = useWorkflowInstance()
const { nodes } = useVueFlow(instanceId)

const variableName = computed(() => 
  props.labelName || (isSystemVar(props.variableSelector) 
    ? props.variableSelector.slice(0).join('.') 
    : props.variableSelector.slice(1).join('.'))
)

const operatorName = computed(() => 
  isComparisonOperatorNeedTranslate(props.operator) 
    ? t(`workflow.nodes.ifElse.comparisonOperator.${props.operator}`) 
    : props.operator
)

const notHasValue = computed(() => comparisonOperatorNotRequireValue(props.operator))

const node = computed(() => 
  nodes.value.find(n => n.id === props.variableSelector[0]) as Node | undefined
)

const isException = computed(() => 
  isExceptionVariable(variableName.value, node.value?.data!.type)
)

const formatValue = computed(() => {
  if (notHasValue.value)
    return ''

  if (Array.isArray(props.value)) // transfer method
    return props.value[0]

  if (props.value === true || props.value === false)
    return props.value ? 'True' : 'False'

  return String(props.value).replace(/{{#([^#]*)#}}/g, (a, b) => {
    const arr: string[] = b.split('.')
    if (isSystemVar(arr))
      return `{{${b}}}`

    return `{{${arr.slice(1).join('.')}}}`
  })
})

const isSelect = computed(() => 
  props.operator === ComparisonOperator.in || props.operator === ComparisonOperator.notIn
)

const selectName = computed(() => {
  if (isSelect.value) {
    const name = [...FILE_TYPE_OPTIONS, ...TRANSFER_METHOD].find(
      item => item.value === (Array.isArray(props.value) ? props.value[0] : props.value)
    )
    return name
      ? t(`workflow.nodes.ifElse.optionName.${name.i18nKey}`).replace(/{{#([^#]*)#}}/g, (a, b) => {
        const arr: string[] = b.split('.')
        if (isSystemVar(arr))
          return `{{${b}}}`

        return `{{${arr.slice(1).join('.')}}}`
      })
      : ''
  }
  return ''
})
</script>

