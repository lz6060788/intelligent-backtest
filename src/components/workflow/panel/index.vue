<template>
  <div
    ref="rightPanelRef"
    tabindex="-1"
    :class="cn('absolute bottom-1 right-2 top-10 z-10 flex outline-none')"
    :key="`${isRestoring}`"
  >
    <slot name="left" />
    <NodePanel
      v-if="selectedNode"
      :id="selectedNode.id"
      :type="selectedNode.type"
      :data="selectedNode.data"
    />
    <div
      class="relative"
      ref="otherPanelRef"
    >
      <slot name="right" />
      <!-- <VersionHistoryPanel
        v-if="showWorkflowVersionHistoryPanel"
        v-bind="versionHistoryPanelProps"
      /> -->
      <!-- <EnvPanel
        v-if="showEnvPanel"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { useWorkflowInstance } from '../hooks/use-workflow-instance'
import NodePanel from '../nodes/panel.vue'
// import EnvPanel from './env-panel.vue'
import cn from '@/utils/classnames'
import { defineAsyncComponent } from 'vue'
// import type { VersionHistoryPanelProps } from '@/app/components/workflow/panel/version-history-panel'

// const VersionHistoryPanel = defineAsyncComponent(() => import('@/app/components/workflow/panel/version-history-panel.vue'))


export interface PanelProps {
  /**
   * 版本历史面板的属性
   */
//   versionHistoryPanelProps?: VersionHistoryPanelProps
}

const props = withDefaults(defineProps<PanelProps>(), {
  versionHistoryPanelProps: undefined,
})


const getEntryWidth = (entry: ResizeObserverEntry, element: HTMLElement): number => {
  if (entry.borderBoxSize?.length > 0)
    return entry.borderBoxSize[0]?.inlineSize ?? 0

  if (entry.contentRect.width > 0)
    return entry.contentRect.width

  return element.getBoundingClientRect().width
}

/**
 * 使用 ResizeObserver 监听元素宽度变化的组合式函数
 * @param callback 宽度变化时的回调函数
 * @param dependencies 依赖项数组（用于触发重新观察）
 */
const useResizeObserver = (
  callback: (width: number) => void,
  dependencies: any[] = [],
) => {
  const elementRef = ref<HTMLDivElement | null>(null)
  let resizeObserver: ResizeObserver | null = null

  const setupObserver = () => {
    const element = elementRef.value
    if (!element) return

    // 如果已有观察者，先断开连接
    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = getEntryWidth(entry, element)
        callback(width)
      }
    })

    resizeObserver.observe(element)

    const initialWidth = element.getBoundingClientRect().width
    callback(initialWidth)
  }

  onMounted(() => {
    setupObserver()
  })

  // 当依赖项变化时，重新设置观察者
  watch(
    dependencies,
    () => {
      // 使用 nextTick 确保 DOM 已更新
      setTimeout(() => {
        setupObserver()
      }, 0)
    },
    { deep: true }
  )

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  return elementRef
}

const { instanceId, instance: workflowStore } = useWorkflowInstance()
const vueFlowStore = useVueFlow(instanceId)

/**
 * 获取当前选中的节点
 */
const selectedNode = computed(() => {
  const { nodes } = vueFlowStore
  const currentNode = nodes.value.find(node => node.data?.selected)

  if (currentNode) {
    return {
      id: currentNode.id,
      type: currentNode.type,
      data: currentNode.data,
    }
  }
  return null
})

/**
 * 环境变量面板显示状态
 */
const showEnvPanel = computed(() => workflowStore.showEnvPanel.value)

/**
 * 是否正在恢复状态（如果 store 中没有此属性，则默认为 false）
 */
const isRestoring = computed(() => {
  // 注意：如果 store 中没有 isRestoring，这里返回 false
  // 根据代码搜索结果，isRestoring 在 Vue 版本中可能已被移除
  return false
})

/**
 * 工作流版本历史面板显示状态
 */
const showWorkflowVersionHistoryPanel = computed(() => workflowStore.showWorkflowVersionHistoryPanel.value)

/**
 * 工作流画布宽度（用于自适应布局）
 */
const workflowCanvasWidth = computed(() => workflowStore.workflowCanvasWidth.value)

/**
 * 预览面板宽度（用于自适应布局）
 */
const previewPanelWidth = computed(() => workflowStore.previewPanelWidth.value)

/**
 * 设置预览面板宽度的方法
 */
const setPreviewPanelWidth = (width: number) => {
  workflowStore.setPreviewPanelWidth(width)
}

/**
 * 当节点被选中且 NodePanel 出现时，如果当前预览/其他面板的宽度太大，
 * 可能导致两个面板的总宽度超过 workflowCanvasWidth，从而将 NodePanel 推出。
 * 这里我们检查并在必要时将 previewPanelWidth 减少到
 * "workflowCanvasWidth - 400 (最小 NodePanel 宽度) - 400 (最小画布空间)"，
 * 同时确保 previewPanelWidth ≥ 400。
 */
watch(
  [selectedNode, workflowCanvasWidth, previewPanelWidth],
  () => {
    if (!selectedNode.value || !workflowCanvasWidth.value)
      return

    const reservedCanvasWidth = 400 // 为画布保留的最小可见宽度
    const minNodePanelWidth = 400
    const maxAllowed = Math.max(workflowCanvasWidth.value - reservedCanvasWidth - minNodePanelWidth, 400)

    if (previewPanelWidth.value > maxAllowed)
      setPreviewPanelWidth(maxAllowed)
  },
  { immediate: true }
)

/**
 * 设置右侧面板宽度的方法
 */
const setRightPanelWidth = (width: number) => {
  workflowStore.setRightPanelWidth(width)
}

/**
 * 设置其他面板宽度的方法
 */
const setOtherPanelWidth = (width: number) => {
  workflowStore.setOtherPanelWidth(width)
}

/**
 * 右侧面板的引用，用于监听宽度变化
 */
const rightPanelRef = useResizeObserver(
  setRightPanelWidth,
  [setRightPanelWidth, selectedNode, showEnvPanel, showWorkflowVersionHistoryPanel],
)

/**
 * 其他面板的引用，用于监听宽度变化
 */
const otherPanelRef = useResizeObserver(
  setOtherPanelWidth,
  [setOtherPanelWidth, showEnvPanel, showWorkflowVersionHistoryPanel],
)
</script>

