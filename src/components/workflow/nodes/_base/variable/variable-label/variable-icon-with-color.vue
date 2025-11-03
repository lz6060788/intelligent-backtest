<template>
  <VariableIcon
    :variables="variables"
    :variable-category="variableCategory"
    :class="cn(varColorClassName, className)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VariableIcon from './base/variable-icon.vue'
import { useVarColor } from './hooks'
import cn from '@/utils/classnames'
import type { VarInInspectType } from '@/types/workflow'

interface VariableIconWithColorProps {
  isExceptionVariable?: boolean
  variableCategory?: VarInInspectType | string
  variables?: string[]
  className?: string
}

const props = withDefaults(defineProps<VariableIconWithColorProps>(), {
  variables: () => [],
})

const varColorClassName = computed(() => {
  const color = useVarColor(props.variables || [], props.isExceptionVariable, props.variableCategory)
  return color.value
})
</script>

