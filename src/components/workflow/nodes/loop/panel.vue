<template>
  <div class="mt-2">
    <div>
      <Field>
        <template #title>
          <div class="pl-3">{{ t('workflow.nodes.loop.loopVariables') }}</div>
        </template>
        <template #operations>
          <div
            class="mr-4 flex h-5 w-5 cursor-pointer items-center justify-center"
            @click="handleAddLoopVariable"
          >
            <RiAddLine class="h-4 w-4 text-text-tertiary" />
          </div>
        </template>
        <div class="px-4">
          <LoopVariable
            :variables="inputs.loop_variables"
            :node-id="id"
            :handle-remove-loop-variable="handleRemoveLoopVariable"
            :handle-update-loop-variable="handleUpdateLoopVariable"
          />
        </div>
      </Field>
      <Split class="my-2" />
      <Field>
        <template #title>
          <div class="pl-3">{{ t(`${i18nPrefix}.breakCondition`) }}</div>
        </template>
        <template #tooltip>
          {{ t(`${i18nPrefix}.breakConditionTip`) }}
        </template>
        <ConditionWrap
          :node-id="id"
          :read-only="readOnly"
          :handle-add-condition="handleAddCondition"
          :handle-remove-condition="handleRemoveCondition"
          :handle-update-condition="handleUpdateCondition"
          :handle-toggle-condition-logical-operator="handleToggleConditionLogicalOperator"
          :handle-add-sub-variable-condition="handleAddSubVariableCondition"
          :handle-remove-sub-variable-condition="handleRemoveSubVariableCondition"
          :handle-update-sub-variable-condition="handleUpdateSubVariableCondition"
          :handle-toggle-sub-variable-condition-logical-operator="handleToggleSubVariableConditionLogicalOperator"
          :available-nodes="loopChildrenNodes"
          :available-vars="childrenNodeVars"
          :conditions="inputs.break_conditions || []"
          :logical-operator="inputs.logical_operator!"
        />
      </Field>
      <Split class="mt-2" />
      <div class="mt-2">
        <Field>
          <template #title>
            <div class="pl-3">{{ t(`${i18nPrefix}.loopMaxCount`) }}</div>
          </template>
          <div class="px-3 py-2">
            <InputNumberWithSlider
              :min="1"
              :max="LOOP_NODE_MAX_COUNT"
              :value="inputs.loop_count"
              @change="(val) => {
                const roundedVal = Math.round(val)
                handleUpdateLoopCount(Number.isNaN(roundedVal) ? 1 : roundedVal)
              }"
            />
          </div>
        </Field>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiAddLine } from '@remixicon/vue'
import Split from '../_base/components/split.vue'
import InputNumberWithSlider from '../_base/components/input-number-with-slider.vue'
import type { LoopNodeType } from './type'
import useConfig from './use-config'
import ConditionWrap from './components/condition-wrap.vue'
import LoopVariable from './components/loop-variables/index.vue'
import type { NodePanelProps } from '@/types/node'
import Field from '@/components/workflow/nodes/_base/components/field.vue'

import { LOOP_NODE_MAX_COUNT } from '@/config'

const i18nPrefix = 'workflow.nodes.loop'

const props = defineProps<NodePanelProps<LoopNodeType>>()

const { id, data } = props
const { t } = useI18n()

const {
  readOnly,
  inputs,
  childrenNodeVars,
  loopChildrenNodes,
  handleAddCondition,
  handleUpdateCondition,
  handleRemoveCondition,
  handleToggleConditionLogicalOperator,
  handleAddSubVariableCondition,
  handleRemoveSubVariableCondition,
  handleUpdateSubVariableCondition,
  handleToggleSubVariableConditionLogicalOperator,
  handleUpdateLoopCount,
  handleAddLoopVariable,
  handleRemoveLoopVariable,
  handleUpdateLoopVariable,
} = useConfig(id, data)
</script>

