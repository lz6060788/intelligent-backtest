<template>
  <div class="relative inline-block">
    <div ref="triggerRef" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
      <slot />
    </div>
    <Teleport to="body" v-if="showTooltip && popupContent">
      <div
        :style="tooltipStyle"
        class="fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none"
      >
        {{ popupContent }}
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface TooltipProps {
  popupContent?: string
  asChild?: boolean
}

const props = defineProps<TooltipProps>()

const triggerRef = ref<HTMLElement>()
const showTooltip = ref(false)
const tooltipStyle = ref({ top: '0px', left: '0px' })

const updateTooltipPosition = () => {
  if (triggerRef.value && showTooltip.value) {
    const rect = triggerRef.value.getBoundingClientRect()
    tooltipStyle.value = {
      top: `${rect.bottom + 5}px`,
      left: `${rect.left}px`,
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateTooltipPosition)
  window.addEventListener('resize', updateTooltipPosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateTooltipPosition)
  window.removeEventListener('resize', updateTooltipPosition)
})
</script>

