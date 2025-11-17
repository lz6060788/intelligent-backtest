<template>
  <el-tooltip
    effect="dark"
    :content="t('workflow.panel.moveToThisNode')"
    placement="top"
  >
    <div
      class="mr-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-state-base-hover"
      @click="handleClick"
    >
      <RiCrosshairLine class="h-4 w-4 text-text-tertiary" />
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiCrosshairLine } from '@remixicon/vue'
import { useVueFlow } from '@vue-flow/core'
import { ElTooltip } from 'element-plus'
// import { useNodesSyncDraft } from '@/app/components/workflow-app/hooks'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'

interface NodePositionProps {
  nodeId: string
}

const props = defineProps<NodePositionProps>()
const { t } = useI18n()
const { instanceId } = useWorkflowInstance()
const vueflowStore = useVueFlow(instanceId)
// const { doSyncWorkflowDraft } = useNodesSyncDraft()

// 获取节点信息
const nodeInfo = computed(() => {
  const nodes = vueflowStore.getNodes
  const currentNode = nodes.value.find((node: any) => node.id === props.nodeId)
  return {
    nodePosition: currentNode?.position,
    nodeWidth: currentNode?.dimensions?.width,
    nodeHeight: currentNode?.dimensions?.height,
  }
})


// 工作流容器
const workflowContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  workflowContainer.value = document.getElementById('workflow-container')
})

// 处理点击事件
const handleClick = () => {
  if (!nodeInfo.value.nodePosition || !nodeInfo.value.nodeWidth || !nodeInfo.value.nodeHeight) return
  if (!workflowContainer.value) return

  const { nodePosition, nodeWidth, nodeHeight } = nodeInfo.value
  const zoom = vueflowStore.getViewport().zoom
  const { clientWidth, clientHeight } = workflowContainer.value
  const { setViewport } = vueflowStore

  setViewport({
    x: (clientWidth - 400 - nodeWidth * zoom) / 2 - nodePosition.x * zoom,
    y: (clientHeight - nodeHeight * zoom) / 2 - nodePosition.y * zoom,
    zoom: zoom,
  })
  // doSyncWorkflowDraft()
}
</script>