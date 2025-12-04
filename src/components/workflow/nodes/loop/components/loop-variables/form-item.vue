<template>
  <div>
    <VarReferencePicker
      v-if="value_type === ValueType.variable"
      :readonly="false"
      :node-id="nodeId"
      :is-show-node-name="true"
      :value="value"
      @change="handleChange"
      :filter-var="filterVar"
      :placeholder="t('workflow.nodes.assigner.setParameter') as string"
    />
    <el-input
      v-if="value_type === ValueType.constant && var_type === VarType.string"
      :model-value="value"
      type="textarea"
      @input="handleInputChange"
      class="min-h-12 w-full"
    />
    <el-input-number
      v-if="value_type === ValueType.constant && var_type === VarType.number"
      :model-value="value"
      @input="handleInputChange"
      class="w-full"
      :step="1"
      controls-position="right"
      align="left"
    />
    <el-select
      v-if="value_type === ValueType.constant && var_type === VarType.boolean"
      :model-value="value"
      @change="handleChange"
      class="w-full"
      :offset="0"
      :show-arrow="false"
    >
      <el-option label="TRUE" :value="true" />
      <el-option label="FALSE" :value="false" />
    </el-select>
    <div
      v-if="value_type === ValueType.constant
        && (var_type === VarType.object || var_type === VarType.arrayString || var_type === VarType.arrayNumber || var_type === VarType.arrayObject)
      "
      class="w-full rounded-[10px] bg-components-input-bg-normal py-2 pl-3 pr-1"
      :style="{ height: editorMinHeight }"
    >
      <CodeEditor
        :model-value="value"
        :is-expand="true"
        :no-wrapper="true"
        :language="CodeLanguage.json"
        @change="handleChange"
        class="w-full"
      >
        <template #placeholder>
          <div class="whitespace-pre">{{ placeholder }}</div>
        </template>
      </CodeEditor>
    </div>
    <!-- <ArrayBoolList
      v-if="value_type === ValueType.constant && var_type === VarType.arrayBoolean"
      class="mt-2"
      :list="value || [false]"
      @change="handleChange"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import Input from '@/components/base/input/index.vue'
import CodeEditor from '@/components/workflow/nodes/_base/editor/code-editor/index.vue'
import { CodeLanguage } from '@/components/workflow/nodes/code/types'
import type {
  LoopVariable,
} from '@/components/workflow/nodes/loop/type'
import type {
  Var,
} from '@/types'
import {
  ValueType,
  VarType,
} from '@/types'

import {
  arrayBoolPlaceholder,
  arrayNumberPlaceholder,
  arrayObjectPlaceholder,
  arrayStringPlaceholder,
  objectPlaceholder,
} from '@/components/workflow/panel/constant/placeholder'
// import ArrayBoolList from '@/components/workflow/panel/chat-variable-panel/components/array-bool-list.vue'

/**
 * 表单项组件的属性定义
 */
interface FormItemProps {
  /** 节点ID */
  nodeId: string
  /** 循环变量项 */
  item: LoopVariable
  /** 变化回调 */
  onChange: (value: any) => void
}

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const props = defineProps<FormItemProps>()

const { t } = useI18n()

const value_type = computed(() => props.item.value_type)
const var_type = computed(() => props.item.var_type)
const value = computed(() => props.item.value)

const handleInputChange = (value: string) => {
  emit('change', value)
}

const handleChange = (value: any) => {
  emit('change', value)
}

const filterVar = (variable: Var) => {
  return variable.type === var_type.value
}

const editorMinHeight = computed(() => {
  if (var_type.value === VarType.arrayObject)
    return '240px'
  return '120px'
})

const placeholder = computed(() => {
  if (var_type.value === VarType.arrayString)
    return arrayStringPlaceholder
  if (var_type.value === VarType.arrayNumber)
    return arrayNumberPlaceholder
  if (var_type.value === VarType.arrayObject)
    return arrayObjectPlaceholder
  if (var_type.value === VarType.arrayBoolean)
    return arrayBoolPlaceholder
  return objectPlaceholder
})
</script>

