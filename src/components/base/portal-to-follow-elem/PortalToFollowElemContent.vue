<template>
  <Teleport to="body" v-if="open">
    <div
      :ref="(el: any) => setRef(el)"
      :style="computedStyle"
      v-bind="props"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import { Teleport } from 'vue'
import type { usePortalToFollowElem } from './usePortalToFollowElem'

interface PortalToFollowElemContentProps {
  style?: Record<string, any>
}

const props = defineProps<PortalToFollowElemContentProps>()

const context = inject<ReturnType<typeof usePortalToFollowElem>>('portalToFollowElem')

if (!context) {
  throw new Error('PortalToFollowElemContent must be used within PortalToFollowElem')
}

const open = computed(() => context.open.value)

const setRef = (el: any) => {
  context.floating.value = el
}

const computedStyle = computed(() => {
  const baseStyle = context.floatingStyles.value || {}
  return {
    ...baseStyle,
    ...props.style,
    visibility: context.middlewareData.value?.hide?.referenceHidden ? 'hidden' : 'visible',
  }
})
</script>

