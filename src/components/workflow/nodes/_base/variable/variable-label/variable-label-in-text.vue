<template>
  <VariableLabel
    :class="cn(
      'h-[18px] space-x-[1px] rounded-[5px] px-1 shadow-xs shadow-gray-700',
    )"
    v-bind="variablePayload"
  />
</template>

<script setup lang="ts">
import type { VariablePayload } from './types'
import VariableLabel from './base/variable-label.vue'
import cn from '@/utils/classnames'

const variablePayload = defineProps<VariablePayload>()
</script>

