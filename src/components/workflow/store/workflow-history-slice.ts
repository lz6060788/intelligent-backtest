import type {
  Node,
  Edge,
  // WorkflowRunningData,
} from '@/types'
// import type { FileUploadConfigResponse } from '@/models/common'
import type { WorkflowHistoryEventT } from '../hooks/use-workflow-history'
import { UNDO_REDO_HISTORY_MAX_COUNT } from '@/config'
import { ref, type Ref } from 'vue'

export type WorkflowHistoryEventMeta = {
  nodeId?: string
  nodeTitle?: string
}

export type WorkflowHistoryState = {
  nodes: Node[]
  edges: Edge[]
  workflowHistoryEvent: WorkflowHistoryEventT | undefined
  workflowHistoryEventMeta?: WorkflowHistoryEventMeta
}

export type WorkflowHistorySliceShape = {
  maxHistoryLength: Ref<number>
  setMaxHistoryLength: (length: number) => void
  historyList: Ref<WorkflowHistoryState[]>
  currentHistoryIndex: Ref<number>
  setCurrentHistoryIndex: (index: number) => void
  getCurrentHistory: () => WorkflowHistoryState | undefined
  getPastHistory: () => WorkflowHistoryState[]
  getFutureHistory: () => WorkflowHistoryState[]
  addHistory: (history: WorkflowHistoryState) => void
  undo: (step?: number) => void
  redo: (step?: number) => void
  clearHistory: () => void
  setHistoryList: (list: WorkflowHistoryState[]) => void
}

export const createWorkflowHistorySlice = () => {
  const maxHistoryLength = ref(UNDO_REDO_HISTORY_MAX_COUNT)
  const setMaxHistoryLength = (length: number) => maxHistoryLength.value = length
  const historyList = ref<WorkflowHistoryState[]>([])

  const currentHistoryIndex = ref(0)
  const setCurrentHistoryIndex = (index: number) => currentHistoryIndex.value = index

  const getCurrentHistory = () => historyList.value[currentHistoryIndex.value]
  const getPastHistory = () => historyList.value.slice(0, currentHistoryIndex.value)
  const getFutureHistory = () => historyList.value.slice(currentHistoryIndex.value + 1)

  const addHistory = (history: WorkflowHistoryState) => {
    historyList.value = [...historyList.value.slice(0, currentHistoryIndex.value + 1), history].slice(-maxHistoryLength.value)
    currentHistoryIndex.value = Math.min(currentHistoryIndex.value + 1, maxHistoryLength.value - 1)
  }
  const undo = (step: number = 1) => {
    currentHistoryIndex.value = Math.max(currentHistoryIndex.value - step, 0)
  }
  const redo = (step: number = 1) => {
    currentHistoryIndex.value = Math.min(currentHistoryIndex.value + step, maxHistoryLength.value - 1)
  }
  const clearHistory = () => {
    historyList.value = []
    currentHistoryIndex.value = 0
  }
  const setHistoryList = (list: WorkflowHistoryState[]) => {
    historyList.value = list
  }

  return {
    maxHistoryLength,
    setMaxHistoryLength,
    historyList,
    currentHistoryIndex,
    setCurrentHistoryIndex,
    getCurrentHistory,
    getPastHistory,
    getFutureHistory,
    addHistory,
    undo,
    redo,
    clearHistory,
    setHistoryList,
  }
}
