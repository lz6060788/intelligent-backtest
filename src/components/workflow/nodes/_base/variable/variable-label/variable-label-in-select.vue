<template>
  <VariableLabel v-bind="variablePayload" />
</template>

<script setup lang="ts">
import type { VariablePayload } from './types'
import VariableLabel from './base/variable-label.vue'

const variablePayload = defineProps<VariablePayload>()
</script>

