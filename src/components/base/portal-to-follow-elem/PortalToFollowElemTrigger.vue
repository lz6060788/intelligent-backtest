<template>
  <div
    v-if="!asChild"
    :ref="(el: any) => setRef(el)"
    :class="cn('inline-block', props.class)"
    :data-state="context.open.value ? 'open' : 'closed'"
    v-bind="props"  
  >
    <slot />
  </div>
  <component
    v-else
    :is="childComponent"
    :ref="(el: any) => setRef(el)"
    :data-state="context.open.value ? 'open' : 'closed'"
    v-bind="{ ...props }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { inject, useSlots, computed } from 'vue'
import cn from '@/utils/classnames'
import type { usePortalToFollowElem } from './usePortalToFollowElem'

interface PortalToFollowElemTriggerProps {
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<PortalToFollowElemTriggerProps>(), {
  asChild: false,
})

const slots = useSlots()
const context = inject<ReturnType<typeof usePortalToFollowElem>>('portalToFollowElem')

if (!context) {
  throw new Error('PortalToFollowElemTrigger must be used within PortalToFollowElem')
}

const childComponent = computed(() => {
  if (props.asChild && slots.default) {
    const children = slots.default()
    if (children && children.length > 0 && children[0]?.type) {
      return children[0].type as any
    }
  }
  return 'div'
})

const setRef = (el: any) => {
  if (el) {
    context.reference.value = el
  }
}

</script>

