<template>
  <div class="flex items-center space-x-0.5 rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg p-0.5 shadow-lg backdrop-blur-[5px]">
    <el-tooltip :content="t('workflow.common.undo')" placement="top">
      <div
        :class="cn(
          'system-sm-medium flex h-8 w-8 cursor-pointer select-none items-center rounded-md px-1.5 text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary',
          (nodesReadOnly || buttonsDisabled.undo) && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
        )"
        @click="handleUndoClick"
      >
        <RiArrowGoBackLine class="h-4 w-4" />
      </div>
    </el-tooltip>
    <el-tooltip :content="t('workflow.common.redo')" placement="top">
      <div
        :class="cn(
          'system-sm-medium flex h-8 w-8 cursor-pointer select-none items-center rounded-md px-1.5 text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary',
          (nodesReadOnly || buttonsDisabled.redo) && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
        )"
        @click="handleRedoClick"
      >
        <RiArrowGoForwardFill class="h-4 w-4" />
      </div>
    </el-tooltip>
    <div class="mx-0.5 h-3.5 w-[1px] bg-divider-regular" />
    <ViewWorkflowHistory />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiArrowGoBackLine, RiArrowGoForwardFill } from '@remixicon/vue'
// import { useNodesReadOnly } from '../hooks'
import ViewWorkflowHistory from './view-workflow-history.vue'
import cn from '@/utils/classnames'
import { storeToRefs } from 'pinia'
import { useVueFlow } from '@vue-flow/core'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'
import { useNodesReadOnly } from '@/components/workflow/hooks/use-workflow'

const { t } = useI18n()
const { instance: workflowStore, instanceId } = useWorkflowInstance()
const { currentHistoryIndex, historyList } = toRefs(workflowStore)
const { nodesReadOnly } = useNodesReadOnly()

const buttonsDisabled = computed(() => {
  return {
    undo: currentHistoryIndex.value === 0,
    redo: currentHistoryIndex.value >= historyList.value.length - 1,
  }
})

const handleUndoClick = () => {
  if (!nodesReadOnly && !buttonsDisabled.value.undo) {
    workflowStore.undo()
    updateNodesAndEdges()
  }
}

const handleRedoClick = () => {
  if (!nodesReadOnly && !buttonsDisabled.value.redo) {
    workflowStore.redo()
    updateNodesAndEdges()
  }
}

const { setNodes, setEdges, nodes } = useVueFlow(instanceId)
const updateNodesAndEdges = () => {
  const currentHistory = workflowStore.getCurrentHistory()
  if (currentHistory) {
    const { nodes, edges } = currentHistory
    if (nodes && edges) {
      setNodes(nodes)
      setEdges(edges)
    }
  }
}
</script>

