<template>
  <component :is="iconComponent" :class="cn('size-3.5 shrink-0', className)" />
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

const iconComponent = computed(() => useVarIcon(props.variables || [], props.variableCategory))
</script>

