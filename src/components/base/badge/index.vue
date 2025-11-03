<template>
  <div :class="cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', className)">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import cn from '@/utils/classnames'

interface BadgeProps {
  text: string
  className?: string
}

withDefaults(defineProps<BadgeProps>(), {
  className: '',
})
</script>

