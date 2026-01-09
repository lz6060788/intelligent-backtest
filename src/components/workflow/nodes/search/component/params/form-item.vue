<template>
  <div>
    <VarReferencePicker
      v-if="type === ValueType.variable"
      :readonly="false"
      :node-id="nodeId"
      :is-show-node-name="true"
      :value="value"
      @change="handleChange"
      :filter-var="filterVar"
      :placeholder="t('workflow.nodes.assigner.setParameter') as string"
    />
    <el-input
      v-else
      :model-value="value"
      type="textarea"
      @input="handleInputChange"
      class="min-h-12 w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import type {
  ValueSelector,
  Var,
} from '@/types'
import {
  ValueType,
  VarType,
} from '@/types'
import type { SearchItemValue } from '../../types'

/**
 * 表单项组件的属性定义
 */
interface FormItemProps {
  /** 节点ID */
  nodeId: string
  /** 循环变量项 */
  item: SearchItemValue
}

const emit = defineEmits<{
  (e: 'change', value: any): void
}>()

const props = defineProps<FormItemProps>()

const { t } = useI18n()

const type = computed(() => props.item.type)
const value = computed(() => props.item.value)

const handleInputChange = (value: string) => {
  emit('change', value)
}

const handleChange = (value: any) => {
  emit('change', value)
}

const filterVar = (variable: Var) => {
  return variable.type === VarType.string
}


</script>

