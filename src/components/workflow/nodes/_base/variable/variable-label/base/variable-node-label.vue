<template>
  <div
    v-if="nodeType"
    class="flex items-center"
  >
    <!-- <VarBlockIcon
      :type="nodeType"
      class="shrink-0 text-text-secondary"
    /> -->
    <div
      v-if="nodeTitle"
      :class="cn('text-xs max-w-[60px] truncate text-white ml-1')"
      :title="nodeTitle"
    >
      {{ nodeTitle }}
    </div>
    <div class="text-white/50 shrink-0 text-white ml-1">/</div>
  </div>
</template>

<script setup lang="ts">
// import { VarBlockIcon } from '@/components/workflow/block-icon'
import cn from '@/utils/classnames'
import type { BlockEnum } from '@/types/node'

interface VariableNodeLabelProps {
  nodeType?: BlockEnum
  nodeTitle?: string
}

defineProps<VariableNodeLabelProps>()
</script>

