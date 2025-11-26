<template>
  <div class="rounded-md bg-workflow-block-parma-bg">
    <div class="flex h-6 items-center px-1">
      <VariableLabelInNode
        class="w-0 grow"
        :variables="variableSelector!"
        :not-show-full-path="true"
      />
      <div
        class="mx-1 shrink-0 text-xs font-medium text-text-primary"
        :title="operatorName"
      >
        {{ operatorName }}
      </div>
    </div>
    <div class="ml-[10px] border-0 border-l border-solid border-gray-600 pl-[10px]">
      <template
        v-for="(c, index) in sub_variable_condition?.conditions"
        :key="c.id"
      >
        <div class="relative flex h-6 items-center space-x-1">
          <div class="text-xs text-text-accent">{{ c.key }}</div>
          <div class="text-xs text-text-primary">
            {{ isComparisonOperatorNeedTranslate(c.comparison_operator) ? t(`workflow.nodes.ifElse.comparisonOperator.${c.comparison_operator}`) : c.comparison_operator }}
          </div>
          <template v-if="c.comparison_operator && !isEmptyRelatedOperator(c.comparison_operator)">
            <div class="text-xs text-text-secondary">
              {{ isSelect(c) ? selectName(c) : formatValue(c) }}
            </div>
          </template>
          <div
            v-if="index !== sub_variable_condition!.conditions.length - 1"
            class="absolute bottom-[-10px] right-1 z-10 text-[10px] font-medium uppercase leading-4 text-text-accent"
          >
            {{ t(`${i18nPrefix}.${sub_variable_condition!.logical_operator}`) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ComparisonOperator, type Condition } from '../types'
import {
  comparisonOperatorNotRequireValue,
  isComparisonOperatorNeedTranslate,
  isEmptyRelatedOperator,
} from '../utils'
import { FILE_TYPE_OPTIONS, TRANSFER_METHOD } from '@/components/workflow/constant'
import type { ValueSelector } from '@/types'
import { isSystemVar } from '@/components/workflow/nodes/_base/variable/utils'
import {
  VariableLabelInNode,
} from '@/components/workflow/nodes/_base/variable/variable-label'
import { computed } from 'vue'

const i18nPrefix = 'workflow.nodes.ifElse'

/**
 * 条件值组件的属性定义
 */
interface ConditionValueProps {
  /** 条件对象 */
  condition: Condition
}

const props = defineProps<ConditionValueProps>()

const { t } = useI18n()

const variableSelector = computed(() => props.condition.variable_selector)

const operator = computed(() => props.condition.comparison_operator)

const sub_variable_condition = computed(() => props.condition.sub_variable_condition)

const operatorName = computed(() => isComparisonOperatorNeedTranslate(operator.value)
  ? t(`workflow.nodes.ifElse.comparisonOperator.${operator.value}`)
  : operator.value)

const formatValue = computed(() => (c: Condition) => {
  const notHasValue = comparisonOperatorNotRequireValue(c.comparison_operator)
  if (notHasValue)
    return ''

  const value = c.value + '' as string
  return value.replace(/{{#([^#]*)#}}/g, (a, b) => {
    const arr: string[] = b.split('.')
    if (isSystemVar(arr))
      return `{{${b}}}`

    return `{{${arr.slice(1).join('.')}}}`
  })
})

const isSelect = (c: Condition) => {
  return c.comparison_operator === ComparisonOperator.in || c.comparison_operator === ComparisonOperator.notIn
}

const selectName = (c: Condition) => {
  const isSelectValue = c.comparison_operator === ComparisonOperator.in || c.comparison_operator === ComparisonOperator.notIn
  if (isSelectValue) {
    const name = [...FILE_TYPE_OPTIONS, ...TRANSFER_METHOD].find(
      item => item.value === (Array.isArray(c.value) ? c.value[0] : c.value)
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
}
</script>

