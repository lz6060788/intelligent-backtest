<template>
  <div>
    <VarReferencePicker
      v-if="!isConst"
      :readonly="false"
      :node-id="nodeId"
      :is-show-node-name="true"
      :value="value as ValueSelector"
      @change="handleChange"
      :filter-var="filterVar"
      :placeholder="t('workflow.nodes.assigner.setParameter') as string"
    />
    <el-input
      v-if="isConst && type === CalculatorArgumentValueTypeEnum.STRING"
      :model-value="value"
      type="textarea"
      @input="handleInputChange"
      class="min-h-12 w-full"
      max-length="64"
    />
    <el-input-number
      v-if="isConst && type === CalculatorArgumentValueTypeEnum.INT"
      :model-value="value"
      @input="handleInputChange"
      class="w-full"
      :step="1"
      controls-position="right"
      align="left"
      max-length="12"
    />
    <el-input-number
      v-if="isConst && type === CalculatorArgumentValueTypeEnum.FLOAT"
      :model-value="value"
      @input="handleInputChange"
      class="w-full"
      controls-position="right"
      align="left"
      max-length="12"
    />
    <el-select
      v-if="isConst && type === CalculatorArgumentValueTypeEnum.BOOL"
      :model-value="value"
      @change="handleChange"
      class="w-full"
      :offset="0"
      :show-arrow="false"
    >
      <el-option label="TRUE" :value="true" />
      <el-option label="FALSE" :value="false" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import {
  VarType,
  type ValueSelector,
  type Var,
} from '@/types'
import { CalculatorArgumentValueTypeEnum } from '../../constant/enums'
import type {
  CalculatorVariable,
} from '../../types'


/**
 * 表单项组件的属性定义
 */
interface FormItemProps {
  /** 节点ID */
  nodeId: string
  /** 循环变量项 */
  item: CalculatorVariable
}

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const props = defineProps<FormItemProps>()

const { t } = useI18n()

const isConst = computed(() => props.item.isConst)
const type = computed(() => props.item.type)
const value = computed(() => props.item.value || '')

const handleInputChange = (value: string) => {
  emit('change', value)
}

const handleChange = (value: any) => {
  emit('change', value)
}

const filterVar = (variable: Var) => {
  if (variable.type === VarType.any) {
    return true
  } else if (variable.type === VarType.number && [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT].includes(type.value)) {
    return true
  } else if (variable.type === VarType[type.value]) {
    return true
  }
  return false
}
</script>

