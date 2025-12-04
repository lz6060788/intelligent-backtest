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

/**
 * 输入模式选择组件的属性定义
 */
interface InputModeSelectProps {
  /** 值 */
  value?: string
}

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

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

