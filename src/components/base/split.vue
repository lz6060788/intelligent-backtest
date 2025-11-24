<template>
  <div :class="cn(props.className, 'h-0.5 w-full bg-divider-regular')">
  </div>
</template>

<script setup lang="ts">
import cn from '@/utils/classnames'

type Props = {
  className?: string
}

const props = defineProps<Props>()
</script>
