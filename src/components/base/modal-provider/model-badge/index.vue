<template>
  <div :class="cn(
    'system-2xs-medium-uppercase flex h-[18px] cursor-default items-center rounded-[5px] border border-solid border-gray-700 px-1 text-gray-2',
    className,
  )">
    <slot />
  </div>
</template>

<script setup lang="ts">
import cn from '@/utils/classnames'

interface ModelBadgeProps {
  className?: string
}

withDefaults(defineProps<ModelBadgeProps>(), {
  className: '',
})
</script>

