<template>
  <div class="w-60">
    <template v-for="(caseItem, index) in cases" :key="caseItem.case_id">
      <div>
        <div class="relative flex h-6 items-center px-1">
          <div class="flex w-full items-center justify-between">
            <div class="text-[10px] font-semibold text-text-tertiary">
              {{ casesLength > 1 ? `CASE ${index + 1}` : '' }}
            </div>
            <div class="text-[12px] font-semibold text-text-secondary">
              {{ index === 0 ? 'IF' : 'ELIF' }}
            </div>
          </div>
          <NodeSourceHandle
            v-bind="props"
            :handleId="caseItem.case_id"
            handleClassName="!top-1/2 !left-auto !-right-[20px] !-translate-y-1/2 z-9999"
          />
        </div>
        <div class="space-y-0.5">
          <template v-for="(condition, i) in caseItem.conditions" :key="condition.id">
            <div class="relative">
              <template v-if="checkIsConditionSet(condition)">
                <template v-if="!isEmptyRelatedOperator(condition.comparison_operator!) && condition.sub_variable_condition">
                  <ConditionFilesListValue :condition="condition" />
                </template>
                <template v-else>
                  <ConditionValue
                    :variableSelector="condition.variable_selector!"
                    :operator="condition.comparison_operator!"
                    :value="
                      condition.varType === VarType.boolean || condition.varType === VarType.arrayBoolean
                        ? condition.value ? condition.value : 'False'
                        : condition.value
                    "
                  />
                </template>
              </template>
              <template v-else>
                <div class="flex h-6 items-center space-x-1 rounded-md bg-workflow-block-parma-bg px-1 text-xs font-normal text-text-secondary">
                  {{ t(`${i18nPrefix}.conditionNotSetup`) }}
                </div>
              </template>

              <div
                v-if="i !== caseItem.conditions.length - 1"
                class="absolute bottom-[-10px] right-1 z-10 text-[10px] font-medium uppercase leading-4 text-blue-400"
              >
                {{ t(`${i18nPrefix}.${caseItem.logical_operator}`) }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>

    <div class="relative flex h-6 items-center px-1">
      <div class="w-full text-right text-xs font-semibold text-text-secondary">ELSE</div>
      <NodeSourceHandle
        v-bind="props"
        handleId="false"
        handleClassName="!top-1/2 !left-auto !-right-[20px] !-translate-y-1/2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { NodeProps } from '@vue-flow/core'
import NodeSourceHandle from '../_base/sourceHandle/index.vue'
import { isEmptyRelatedOperator } from './utils.ts'
import type { Condition, IfElseNodeType } from './types.ts'
import ConditionValue from './components/condition-value.vue'
import ConditionFilesListValue from './components/condition-files-list-value.vue'
import { VarType } from '@/types'

const i18nPrefix = 'workflow.nodes.ifElse'

// 定义组件接收的props
const props = defineProps<{
  data: IfElseNodeType
} & NodeProps<IfElseNodeType>>()

// 解构i18n
const { t } = useI18n()

// 计算属性
const cases = computed(() => props.data.cases)
const casesLength = computed(() => cases.value.length)

// 检查条件是否设置
const checkIsConditionSet = (condition: Condition) => {
  if (!condition.variable_selector || condition.variable_selector.length === 0)
    return false

  if (condition.sub_variable_condition) {
    return condition.sub_variable_condition.conditions.every((c) => {
      if (!c.comparison_operator)
        return false

      return (c.varType === VarType.boolean || c.varType === VarType.arrayBoolean) ? true : !!c.value
    })
  }
  else {
    if (isEmptyRelatedOperator(condition.comparison_operator!))
      return true
    return (condition.varType === VarType.boolean || condition.varType === VarType.arrayBoolean) ? true : !!condition.value
  }
}
</script>
