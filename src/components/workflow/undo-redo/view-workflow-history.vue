<template>
  <el-popover
    v-model:visible="open"
    placement="top-start"
    :offset="4"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
    width="auto"
  >
    <template #reference>
      <!-- <el-tooltip :content="t('workflow.changeHistory.title')" placement="top">
        <div
          :class="cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary',
            open && 'bg-state-accent-active text-text-accent',
            nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
          )"
        >
      </div>
    </el-tooltip> -->
    <RiHistoryLine class="h-4 w-4" />
    </template>
    <div class="z-[12] ml-2 flex min-w-[240px] max-w-[360px] flex-col overflow-y-auto rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur shadow-xl backdrop-blur-[5px]">
      <div class="sticky top-0 flex items-center justify-between px-4 pt-3">
        <div class="system-mg-regular grow text-text-secondary">{{ t('workflow.changeHistory.title') }}</div>
        <div
          class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center"
          @click="open = false"
        >
          <RiCloseLine class="h-4 w-4 text-text-secondary" />
        </div>
      </div>
      <div
        class="overflow-y-auto p-2"
        :style="{
          maxHeight: 'calc(1 / 2 * 100vh)',
        }"
      >
        <template v-if="!displayedHistoryList.length">
          <div class="py-12">
            <RiHistoryLine class="mx-auto mb-2 h-8 w-8 text-text-tertiary" />
            <div class="text-center text-[13px] text-text-tertiary">
              {{ t('workflow.changeHistory.placeholder') }}
            </div>
          </div>
        </template>
        <div class="flex flex-col">
          <div
            v-for="(item, index) in displayedHistoryList"
            :key="index"
            :class="cn(
              'mb-0.5 flex cursor-pointer rounded-lg px-2 py-[7px] text-gray-2 hover:bg-gray-700',
              item.index === currentHistoryIndex && 'bg-gray-600'
            )"
            @click="handleSetState(item)"
          >
            <div>
              <div class="flex items-center text-[13px] font-medium leading-[18px] text-text-secondary">
                {{ composeHistoryItemLabel(
                  item?.state?.workflowHistoryEventMeta?.nodeTitle,
                  item?.label || t('workflow.changeHistory.sessionStart')
                ) }} ({{ calculateStepLabel(item?.index) }}{{ item?.index === currentHistoryIndex ? t('workflow.changeHistory.currentState') : '' }})
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="!!displayedHistoryList.length">
        <div class="px-2">
          <div class="m-0 h-[1px] bg-gray-800" />
          <div
            :class="cn(
              'my-0.5 flex cursor-pointer rounded-lg px-2 py-[7px] text-gray-2',
              'hover:bg-gray-800'
            )"
            @click="handleClearHistory"
          >
            <div>
              <div class="flex items-center text-[13px] font-medium leading-[18px]">
                {{ t('workflow.changeHistory.clearHistory') }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="w-[240px] px-3 py-2 text-xs text-text-tertiary">
        <div class="mb-1 flex h-[22px] items-center font-medium uppercase">{{ t('workflow.changeHistory.hint') }}</div>
        <div class="mb-1 leading-[18px] text-text-tertiary">{{ t('workflow.changeHistory.hintText') }}</div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed, unref, onMounted, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVueFlow } from '@vue-flow/core'
import { RiCloseLine, RiHistoryLine } from '@remixicon/vue'
import { useWorkflowHistory } from '../hooks'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'
import type { WorkflowHistoryState } from '../store/workflow-history-slice.ts'
import cn from '@/utils/classnames'

/**
 * 变更历史条目类型
 */
type ChangeHistoryEntry = {
  label: string
  index: number
  state: Partial<WorkflowHistoryState>
}

const { t } = useI18n()
const open = ref(false)
// const { nodesReadOnly } = useNodesReadOnly()
const nodesReadOnly = ref(false);
const { store, getHistoryLabel, refreshHistoryList } = useWorkflowHistory()
const { instance: workflowStore, instanceId } = useWorkflowInstance()
const vueFlowStore = useVueFlow(instanceId)

// TODO： 临时处理，后续触发方式或者整体历史队列机制需要调整
onMounted(() => {
  setTimeout(() => {
    refreshHistoryList()
  }, 3000);
})

// const { historyList, currentHistoryIndex } = toRefs(workflowStore)
const historyList = computed(() => {
  return workflowStore.historyList.value
})
const currentHistoryIndex = computed(() => {
  return workflowStore.currentHistoryIndex.value
})

const handleClearHistory = () => {
  workflowStore.clearHistory()
  const { nodes, edges } = vueFlowStore
  workflowStore.setHistoryList([{ nodes: unref(nodes), edges: unref(edges), workflowHistoryEvent: undefined }])
  open.value = false
}

const handleSetState = (item: ChangeHistoryEntry) => {
  const { index } = item
  const { setEdges, setNodes } = vueFlowStore
  const diff = index - currentHistoryIndex.value

  if (diff === 0) return

  if (diff < 0) {
    workflowStore.undo(diff * -1)
  } else {
    workflowStore.redo(diff)
  }

  const currentHistory = workflowStore.getCurrentHistory()
  if (currentHistory) {
    const { edges, nodes } = currentHistory
    if (edges.length === 0 && nodes.length === 0) return

    setNodes(nodes)
    setEdges(edges)
  }

  open.value = false
}

const calculateStepLabel = (index: number) => {
  if (index === currentHistoryIndex.value) return ''

  const diff = index - currentHistoryIndex.value
  return diff < 0
    ? t('workflow.changeHistory.stepBackward', { count: diff * -1 })
    : t('workflow.changeHistory.stepForward', { count: diff })
}

const displayedHistoryList = computed(() => {
  return historyList.value
      .map((state: Partial<WorkflowHistoryState>, index: number) => {
        const nodes = (state.nodes || vueFlowStore.nodes.value) || []
        const nodeId = state?.workflowHistoryEventMeta?.nodeId
        const targetTitle = nodes.find(n => n.id === nodeId)?.data?.title ?? ''
        // console.log(getHistoryLabel(state.workflowHistoryEvent))
        return {
          label: state.workflowHistoryEvent && getHistoryLabel(state.workflowHistoryEvent),
          index: index,
          state: {
            ...state,
            workflowHistoryEventMeta: state.workflowHistoryEventMeta ? {
              ...state.workflowHistoryEventMeta,
              nodeTitle: state.workflowHistoryEventMeta.nodeTitle || targetTitle,
            } : undefined,
          },
        }
      })
      .reverse()
      .filter(Boolean) as ChangeHistoryEntry[]
})


const composeHistoryItemLabel = (nodeTitle: string | undefined, baseLabel: string) => {
  if (!nodeTitle) return baseLabel
  return `${nodeTitle} ${baseLabel}`
}

</script>

