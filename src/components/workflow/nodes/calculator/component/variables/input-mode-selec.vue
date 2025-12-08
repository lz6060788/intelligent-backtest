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
import { useI18n } from 'vue-i18n'
import { CalculatorArgumentTypeEnum, type CalculatorArgument } from '../../types'
import { computed } from 'vue';

/**
 * 输入模式选择组件的属性定义
 */
interface InputModeSelectProps {
  value?: boolean
  template: CalculatorArgument
}

const emit = defineEmits<{
  (e: 'change', value: boolean): void
}>()

const props = defineProps<InputModeSelectProps>()

const { t } = useI18n()

const options = computed(() => {
  if (props.template.type === CalculatorArgumentTypeEnum.CONSTANT) {
    return [
      {
        label: 'Constant',
        value: true,
      },
    ]
  } else if (props.template.type === CalculatorArgumentTypeEnum.VARIABLE) {
    return [
      {
        label: 'Variable',
        value: false,
      },
    ]
  }
  return [
    {
      label: 'Variable',
      value: false,
    },
    {
      label: 'Constant',
      value: true,
    },
  ]
})
</script>

