<template>
  <div class="p-1">
    <ConditionWrap
      :node-id="id"
      :cases="cases"
      :read-only="readOnly"
      @remove-case="handleRemoveCase"
      @add-condition="handleAddCondition"
      @remove-condition="handleRemoveCondition"
      @update-condition="handleUpdateCondition"
      @toggle-condition-logical-operator="handleToggleConditionLogicalOperator"
      @add-sub-variable-condition="handleAddSubVariableCondition"
      @remove-sub-variable-condition="handleRemoveSubVariableCondition"
      @update-sub-variable-condition="handleUpdateSubVariableCondition"
      @toggle-sub-variable-condition-logical-operator="handleToggleSubVariableConditionLogicalOperator"
      :nodes-output-vars="nodesOutputVars"
      :available-nodes="availableNodes"
      :vars-is-var-file-attribute="varsIsVarFileAttribute"
      :filter-var="filterVar"
    />
    <div class="px-4 py-2">
      <el-button
        class="w-full"
        variant="tertiary"
        @click="handleAddCase"
        :disabled="readOnly"
      >
        <RiAddLine class="mr-1 h-4 w-4" />
        ELIF
      </el-button>
    </div>
    <div class="mx-3 my-2 h-px bg-divider-subtle"></div>
    <Field
      :title="t(`${i18nPrefix}.else`)"
      class="px-4 py-2"
    >
      <div class="text-xs font-normal leading-[18px] text-text-tertiary">
        {{ t(`${i18nPrefix}.elseDescription`) }}
      </div>
    </Field>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n' // 对应 react-i18next
import { RiAddLine } from '@remixicon/vue' // remixicon vue 版本
import useConfig from './use-config'
import type { IfElseNodeType } from './types'
import ConditionWrap from './components/condition-wrap.vue' // Vue 组件后缀规范
import type { NodePanelProps } from '@/types'
import Field from '@/components/base/field.vue'

interface Props extends NodePanelProps<IfElseNodeType> {
  id: string
  data: IfElseNodeType
}

const props = defineProps<Props>()

const i18nPrefix = 'workflow.nodes.ifElse'

const { t } = useI18n()

const payload = computed(() => props.data)
const {
  readOnly,
  filterVar,
  handleAddCase,
  handleRemoveCase,
  handleAddCondition,
  handleUpdateCondition,
  handleRemoveCondition,
  handleToggleConditionLogicalOperator,
  handleAddSubVariableCondition,
  handleRemoveSubVariableCondition,
  handleUpdateSubVariableCondition,
  handleToggleSubVariableConditionLogicalOperator,
  nodesOutputVars,
  availableNodes,
  varsIsVarFileAttribute
} = useConfig(props.id, payload)

// 计算属性 (对应 React 中的变量推导)
const cases = computed(() => payload.value.cases || [])

defineExpose({
  handleAddCase,
  handleRemoveCase,
  // handleSortCase
})
</script>
