<template>
  <VariableLabel
    :class="cn(
      'w-full space-x-[1px] bg-workflow-block-parma-bg px-1 shadow-none',
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

