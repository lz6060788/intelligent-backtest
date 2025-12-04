<template>
  <el-select
    :model-value="value"
    @change="emit('change', $event)"
    :options="options"
    class="w-full"
    :offset="0"
    :show-arrow="false"
  />
</template>

<script setup lang="ts">
import { VarType } from '@/types'

/**
 * 变量类型选择组件的属性定义
 */
interface VariableTypeSelectProps {
  /** 值 */
  value?: string
}

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const props = defineProps<VariableTypeSelectProps>()

const options = [
  {
    label: 'String',
    value: VarType.string,
  },
  {
    label: 'Number',
    value: VarType.number,
  },
  {
    label: 'Object',
    value: VarType.object,
  },
  {
    label: 'Boolean',
    value: VarType.boolean,
  },
  {
    label: 'Array[string]',
    value: VarType.arrayString,
  },
  {
    label: 'Array[number]',
    value: VarType.arrayNumber,
  },
  {
    label: 'Array[object]',
    value: VarType.arrayObject,
  },
  // {
  //   label: 'Array[boolean]',
  //   value: VarType.arrayBoolean,
  // },
]
</script>

