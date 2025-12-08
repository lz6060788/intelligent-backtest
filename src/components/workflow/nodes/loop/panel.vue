<template>
  <div class="mt-2">
    <div>
      <Field>
        <template #title>
          <div class="pl-3">{{ t('workflow.nodes.loop.loopVariables') }}</div>
        </template>
        <template #operations>
          <div
            class="mr-4 flex h-5 w-5 cursor-pointer items-center justify-center text-text-tertiary hover:bg-blue-500 hover:text-white rounded-lg"
            @click="handleAddLoopVariable"
          >
            <RiAddLine class="h-4 w-4" />
          </div>
        </template>
        <div class="px-4">
          <LoopVariable
            :variables="payload.loop_variables"
            :node-id="id"
            @remove-loop-variable="handleRemoveLoopVariable"
            @update-loop-variable="handleUpdateLoopVariable"
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
          @add-condition="handleAddCondition"
          @remove-condition="handleRemoveCondition"
          @update-condition="handleUpdateCondition"
          @toggle-condition-logical-operator="handleToggleConditionLogicalOperator"
          @add-sub-variable-condition="handleAddSubVariableCondition"
          @remove-sub-variable-condition="handleRemoveSubVariableCondition"
          @update-sub-variable-condition="handleUpdateSubVariableCondition"
          @toggle-sub-variable-condition-logical-operator="handleToggleSubVariableConditionLogicalOperator"
          :available-nodes="loopChildrenNodes"
          :available-vars="childrenNodeVars"
          :conditions="payload.break_conditions || []"
          :logical-operator="payload.logical_operator!"
        />
      </Field>
      <Split class="mt-2" />
      <div class="mt-2">
        <Field>
          <template #title>
            <div class="pl-3">{{ t(`${i18nPrefix}.loopMaxCount`) }}</div>
          </template>
          <div class="px-3 py-2">
            <el-input-number
              :model-value="payload.loop_count"
              :min="1"
              :max="LOOP_NODE_MAX_COUNT"
              :step="1"
              @change="handleUpdateLoopCount"
              size="small"
              class="w-full"
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
import Split from '@/components/base/split.vue'
// import InputNumberWithSlider from '@/components/base/input-number-with-slider.vue'
import type { LoopNodeType } from './type'
import useConfig from './use-config'
import ConditionWrap from './components/condition-wrap.vue'
import LoopVariable from './components/loop-variables/index.vue'
import type { NodePanelProps } from '@/types'
import Field from '@/components/base/field.vue'

import { LOOP_NODE_MAX_COUNT } from '@/config'
import { computed } from 'vue'

const i18nPrefix = 'workflow.nodes.loop'

const props = defineProps<NodePanelProps<LoopNodeType>>()

const payload = computed(() => props.data)

const { id, data } = props
const { t } = useI18n()

const {
  readOnly,
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
} = useConfig(id, payload)
</script>

