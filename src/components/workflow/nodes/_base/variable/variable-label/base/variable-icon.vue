<template>
  <i v-if="iconClass" :class="cn('size-3.5 shrink-0', iconClass, className)" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVarIcon } from '../hooks'
import cn from '@/utils/classnames'
import type { VarInInspectType } from '@/types/workflow'

export interface VariableIconProps {
  className?: string
  variables?: string[]
  variableCategory?: VarInInspectType | string
}

const props = withDefaults(defineProps<VariableIconProps>(), {
  variables: () => [],
})

const iconClass = computed(() => useVarIcon(props.variables || [], props.variableCategory))
</script>

