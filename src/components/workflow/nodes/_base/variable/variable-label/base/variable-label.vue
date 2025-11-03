<template>
  <div
    :class="cn(
      'inline-flex h-6 max-w-full items-center space-x-0.5 rounded-md border-[0.5px] border-blue-600 border-solid bg-gray-600 px-1.5 shadow-xs',
      className,
    )"
    @click="handleClick"
    ref="labelRef"
  >
    <VariableNodeLabel
      :node-type="nodeType"
      :node-title="nodeTitle"
    />
    <template v-if="notShowFullPath">
      <i class="i-ri-more-line h-3 w-3 shrink-0 text-white" />
      <div class="text-white/50 shrink-0 text-white">/</div>
    </template>
    <VariableIcon
      :variables="variables"
      :class="varColorClassName"
    />
    <VariableName
      :variables="variables"
      :class="cn(varColorClassName)"
      :not-show-full-path="notShowFullPath"
    />
    <div
      v-if="variableType"
      class="text-xs shrink-0 text-white/50"
    >
      {{ capitalize(variableType) }}
    </div>
    <Tooltip
      v-if="errorMsg"
      :popup-content="errorMsg"
    >
      <i class="i-ri-error-warning-fill h-3 w-3 shrink-0 text-red-500" />
    </Tooltip>
    <slot name="right-slot" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { capitalize } from 'lodash-es'
import type { VariablePayload } from '../types'
import { useVarColor } from '../hooks'
import VariableNodeLabel from './variable-node-label.vue'
import VariableIcon from './variable-icon.vue'
import VariableName from './variable-name.vue'
import Tooltip from '@/components/base/tooltip/index.vue'
import cn from '@/utils/classnames'

const props = defineProps<VariablePayload>()

const labelRef = ref<HTMLDivElement>()

const varColorClassName = computed(() => {
  const color = useVarColor(props.variables || [], props.isExceptionVariable)
  return color.value
})

const handleClick = (e: MouseEvent) => {
  props.onClick?.(e)
}

defineExpose({
  ref: labelRef,
})
</script>

