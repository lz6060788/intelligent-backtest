<template>
  <div
    ref="bottomPanelRef"
    class="absolute bottom-0 left-0 right-0 z-10 px-1"
    :style="{ width: bottomPanelWidth }"
  >
    <div class="flex justify-between px-1 pb-2">
      <div class="flex items-center gap-2">
        <UndoRedo />
      </div>
      <!-- <VariableTrigger /> -->
      <div class="relative">
        <MiniMap
        />
        <!-- <ZoomInOut /> -->
      </div>
    </div>
    <!-- <VariableInspectPanel /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/minimap/dist/style.css'

import UndoRedo from '../undo-redo/index.vue'
// import ZoomInOut from './zoom-in-out.vue'
// import VariableTrigger from '../variable-inspect/trigger.vue'
// import VariableInspectPanel from '../variable-inspect.vue'
// import { useWorkflowStore } from '../store'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'


const bottomPanelRef = ref<HTMLDivElement | null>(null)
// const { instance: workflowStore, instanceId } = useWorkflowInstance()

// 从store获取状态
// const workflowCanvasWidth = computed(() => store.workflowCanvasWidth)
// const rightPanelWidth = computed(() => store.rightPanelWidth)
// const setBottomPanelWidth = (width: number) => store.setBottomPanelWidth(width)
// const setBottomPanelHeight = (height: number) => store.setBottomPanelHeight(height)

// 计算bottomPanelWidth
const bottomPanelWidth = computed(() => {
  return 'auto'
  // if (!workflowCanvasWidth.value || !rightPanelWidth.value) {
  //   return 'auto'
  // }
  // return `${Math.max(workflowCanvasWidth.value - rightPanelWidth.value, 400)}px`
})

// 处理ResizeObserver
let resizeContainerObserver: ResizeObserver | null = null

onMounted(() => {
  if (bottomPanelRef.value) {
    resizeContainerObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // const { inlineSize, blockSize } = entry.borderBoxSize[0]
        // setBottomPanelWidth(inlineSize)
        // setBottomPanelHeight(blockSize)
      }
    })
    resizeContainerObserver.observe(bottomPanelRef.value)
  }
})

onUnmounted(() => {
  if (resizeContainerObserver) {
    resizeContainerObserver.disconnect()
  }
})
</script>