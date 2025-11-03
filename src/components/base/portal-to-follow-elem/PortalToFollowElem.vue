<template>
  <slot />
</template>

<script setup lang="ts">
import { provide, watch } from 'vue'
import { usePortalToFollowElem, type PortalToFollowElemOptions } from './usePortalToFollowElem'

const props = withDefaults(defineProps<PortalToFollowElemOptions & {
  'onUpdate:open'?: (open: boolean) => void
}>(), {
  placement: 'bottom',
  offset: 0,
})

const emit = defineEmits<{
  'update:open': [open: boolean]
}>()

const tooltip = usePortalToFollowElem({
  ...props,
  onOpenChange: (open: boolean) => {
    emit('update:open', open)
    props.onOpenChange?.(open)
  },
})

provide('portalToFollowElem', tooltip)

watch(() => props.open, (newOpen) => {
  if (newOpen !== undefined && newOpen !== tooltip.open.value) {
    tooltip.setOpen(newOpen)
  }
})
</script>

