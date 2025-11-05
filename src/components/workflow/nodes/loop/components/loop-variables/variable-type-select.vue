<template>
  <PureSelect
    :options="options"
    :value="value"
    @change="onChange"
    :popup-props="{
      className: 'w-[132px]',
    }"
  />
</template>

<script setup lang="ts">
import PureSelect from '@/components/base/select/pure.vue'
import { VarType } from '@/types'

/**
 * 变量类型选择组件的属性定义
 */
interface VariableTypeSelectProps {
  /** 值 */
  value?: string
  /** 变化回调 */
  onChange: (value: string) => void
}

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
  {
    label: 'Array[boolean]',
    value: VarType.arrayBoolean,
  },
]
</script>

