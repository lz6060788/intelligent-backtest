<template>
  <div class="flex h-6 items-center rounded-md bg-workflow-block-parma-bg px-1">
    <VariableLabelInNode
      class="w-0 grow"
      :variables="variableSelector"
      :not-show-full-path="true"
    />
    <div
      class="mx-1 shrink-0 text-xs font-medium text-text-primary"
      :title="operatorName"
    >
      {{ operatorName }}
    </div>
    <div
      v-if="!notHasValue"
      class="truncate text-xs text-text-secondary"
      :title="formatValue"
    >
      {{ isSelect ? selectName : formatValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ComparisonOperator } from '../type'
import {
  comparisonOperatorNotRequireValue,
  isComparisonOperatorNeedTranslate,
} from '../utils'
import { FILE_TYPE_OPTIONS, TRANSFER_METHOD } from '../default'
import { isSystemVar } from '@/components/workflow/nodes/_base/variable/utils'
import {
  VariableLabelInNode,
} from '@/components/workflow/nodes/_base/variable/variable-label'

/**
 * 条件值组件的属性定义
 */
interface ConditionValueProps {
  /** 变量选择器 */
  variableSelector: string[]
  /** 标签名称 */
  labelName?: string
  /** 操作符 */
  operator: ComparisonOperator
  /** 值 */
  value: string | string[]
}

const props = defineProps<ConditionValueProps>()

const { t } = useI18n()

const operatorName = computed(() => {
  return isComparisonOperatorNeedTranslate(props.operator) ? t(`workflow.nodes.ifElse.comparisonOperator.${props.operator}`) : props.operator
})

const notHasValue = computed(() => comparisonOperatorNotRequireValue(props.operator))

const formatValue = computed(() => {
  if (notHasValue.value)
    return ''

  if (Array.isArray(props.value)) // transfer method
    return props.value[0]

  return props.value.replace(/{{#([^#]*)#}}/g, (a, b) => {
    const arr: string[] = b.split('.')
    if (isSystemVar(arr))
      return `{{${b}}}`

    return `{{${arr.slice(1).join('.')}}}`
  })
})

const isSelect = computed(() => props.operator === ComparisonOperator.in || props.operator === ComparisonOperator.notIn)

const selectName = computed(() => {
  if (isSelect.value) {
    const name = [...FILE_TYPE_OPTIONS, ...TRANSFER_METHOD].filter(item => item.value === (Array.isArray(props.value) ? props.value[0] : props.value))[0]
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

