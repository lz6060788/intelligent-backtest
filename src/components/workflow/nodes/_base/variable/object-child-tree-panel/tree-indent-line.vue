<template>
  <div :class="cn('flex', className)">
    <div
      v-for="d in depthArray"
      :key="d"
      :class="cn('ml-2.5 mr-2.5 w-px bg-divider-regular')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import cn from '@/utils/classnames'

const props = defineProps<{
  depth?: number
  className?: string
}>()

const depthArray = computed(() => {
  const length = props.depth ?? 1
  return Array.from({ length }, (_, index) => index)
})
</script>