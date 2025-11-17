<template>
  <div class="mt-2">
    <div class="space-y-4 px-4 pb-4">
      <Field
        :title="t(`${i18nPrefix}.inputVars`)"
      >
        <template #operations>
          <div v-if="!readOnly" class="flex gap-2">
            <SyncButton @click="handleSyncFunctionSignature" :popupContent="t(`${i18nPrefix}.syncFunctionSignature`)"></SyncButton>
            <AddButton @click="handleAddVariable" />
          </div>
        </template>
        <var-list
          :readonly="readOnly"
          :node-id="id"
          :list="inputs.variables"
          @change="handleVarListChange"
          :filter-var="filterVar"
          :is-support-file-var="false"
        />
      </Field>
      <CodeEditor
        :node-id="id"
        :is-in-node="true"
        :readonly="readOnly"
        :language="inputs.code_language"
        :value="inputs.code"
        @change="handleCodeChange"
        @generated="handleGeneratedCode"
        :show-code-generator="true"
      >
        <template #title>
          <!-- TypeSelector 使用 el-select 替代 -->
          <!-- 原组件：TypeSelector from '@/app/components/workflow/nodes/_base/components/selector' -->
          <el-select
            :model-value="inputs.code_language"
            @change="handleCodeLanguageChange"
            size="small"
            class="w-32"
          >
            <el-option
              v-for="lang in codeLanguages"
              :key="lang.value"
              :label="lang.label"
              :value="lang.value"
            />
          </el-select>
        </template>
      </CodeEditor>
    </div>
    <el-divider />
    <div class="px-4 pb-2 pt-4">
      <Field
        :title="t(`${i18nPrefix}.outputVars`)"
        :required="true"
      >
        <template #operations>
          <AddButton @click="handleAddOutputVariable" />
        </template>
        <output-var-list
          :readonly="readOnly"
          :outputs="inputs.outputs"
          :outputKeyOrders="outputKeyOrders"
          @change="handleVarsChange"
          @remove="handleRemoveVariable"
        />
      </Field>
    </div>
    <RemoveEffectVarConfirm
      :is-show="isShowRemoveVarConfirm"
      @cancel="hideRemoveVarConfirm"
      @confirm="onRemoveVarConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Refresh, Delete } from '@element-plus/icons-vue'
import RemoveEffectVarConfirm from '../_base/remove-effect-var-confrim/index.vue'
import useConfig from './use-config'
import type { CodeNodeType } from './types'
import { CodeLanguage } from './types'
import { extractFunctionParams, extractReturnType } from './code-parser'
import Field from '@/components/base/field.vue'
import outputVarList from '../_base/variable/output-var-list.vue'
import varList from '../_base/variable/var-list.vue'
import CodeEditor from '../_base/editor/code-editor/index.vue'
import AddButton from '@/components/base/add-button/index.vue'
import type { NodePanelProps } from '@/types'
import SyncButton from '@/components/base/sync-button/index.vue'

const i18nPrefix = 'workflow.nodes.code'

/**
 * 代码语言选项
 */
const codeLanguages = [
  {
    label: 'Python3',
    value: CodeLanguage.python3,
  },
  {
    label: 'JavaScript',
    value: CodeLanguage.javascript,
  },
]

const props = defineProps<NodePanelProps<CodeNodeType>>()

const { t } = useI18n()

const data = computed(() => props.data)

const {
  readOnly,
  inputs,
  outputKeyOrders,
  handleCodeAndVarsChange,
  handleVarListChange,
  handleAddVariable,
  handleRemoveVariable,
  handleSyncFunctionSignature,
  handleCodeChange,
  handleCodeLanguageChange,
  handleVarsChange,
  handleAddOutputVariable,
  filterVar,
  isShowRemoveVarConfirm,
  hideRemoveVarConfirm,
  onRemoveVarConfirm,
} = useConfig(props.id, data)

/**
 * 处理生成的代码
 */
const handleGeneratedCode = (value: string) => {
  const params = extractFunctionParams(value, inputs.value.code_language)
  const codeNewInput = params.map((p) => {
    return {
      variable: p,
      value_selector: [],
    }
  })
  const returnTypes = extractReturnType(value, inputs.value.code_language)
  handleCodeAndVarsChange(value, codeNewInput, returnTypes)
}

</script>

