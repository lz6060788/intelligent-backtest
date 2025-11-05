<template>
  <PureSelect
    :options="options"
    :value="value"
    @change="onChange"
    :popup-props="{
      title: t('workflow.nodes.loop.inputMode'),
      className: 'w-[132px]',
    }"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PureSelect from '@/components/base/select/pure.vue'

/**
 * 输入模式选择组件的属性定义
 */
interface InputModeSelectProps {
  /** 值 */
  value?: string
  /** 变化回调 */
  onChange: (value: string) => void
}

const props = defineProps<InputModeSelectProps>()

const { t } = useI18n()

const options = [
  {
    label: 'Variable',
    value: 'variable',
  },
  {
    label: 'Constant',
    value: 'constant',
  },
]
</script>

