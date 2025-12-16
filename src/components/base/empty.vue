<template>
  <div :class="cn('col-span-full text-center text-gray-600 bg-gray-900/40 border-solid border border-gray-800 rounded-xl py-12', className)">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import cn from '@/utils/classnames'

// Props
const props = defineProps<{
  text: string;
  className?: string;
}>()
</script>

<style scoped>
</style>