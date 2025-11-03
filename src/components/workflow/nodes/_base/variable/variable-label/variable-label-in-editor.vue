<template>
  <VariableLabel
    :class="cn(
      'h-[18px] space-x-[1px] rounded-[5px] px-1 shadow-xs',
      !isSelected && hoverBgColor,
      !isSelected && hoverBorderColor,
      isSelected && 'border',
      isSelected && selectedBorderColor,
      isSelected && selectedBgColor,
    )"
    v-bind="restProps"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { VariablePayload } from './types'
import VariableLabel from './base/variable-label.vue'
import { useVarBgColorInEditor } from './hooks'
import cn from '@/utils/classnames'

interface VariableLabelInEditorProps extends VariablePayload {
  isSelected?: boolean
}

const props = defineProps<VariableLabelInEditorProps>()

const {
  hoverBorderColor,
  hoverBgColor,
  selectedBorderColor,
  selectedBgColor,
} = useVarBgColorInEditor(props.variables || [], !!props.errorMsg)

const restProps = computed(() => {
  const { isSelected, ...rest } = props
  return rest
})
</script>

