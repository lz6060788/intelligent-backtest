import { useVueFlow } from "@vue-flow/core"
import type { WorkflowHistoryEventMeta } from "../store/workflow-history-slice"
import { useWorkflowStore } from "../store/index"
import { useI18n } from "vue-i18n"
import { ref, unref } from "vue"
import { cloneDeep, debounce } from "lodash-es"


export const WorkflowHistoryEvent = {
  NodeTitleChange: 'NodeTitleChange',
  NodeDescriptionChange: 'NodeDescriptionChange',
  NodeDragStop: 'NodeDragStop',
  NodeChange: 'NodeChange',
  NodeConnect: 'NodeConnect',
  NodePaste: 'NodePaste',
  NodeDelete: 'NodeDelete',
  EdgeDelete: 'EdgeDelete',
  EdgeDeleteByDeleteBranch: 'EdgeDeleteByDeleteBranch',
  NodeAdd: 'NodeAdd',
  NodeResize: 'NodeResize',
  NoteAdd: 'NoteAdd',
  NoteChange: 'NoteChange',
  NoteDelete: 'NoteDelete',
  LayoutOrganize: 'LayoutOrganize',
} as const

export type WorkflowHistoryEventT = keyof typeof WorkflowHistoryEvent

export const useWorkflowHistory = () => {
  const store = useVueFlow()
  const workflowHistoryStore = useWorkflowStore()
  const { t } = useI18n()

  const undoCallbacks = ref<(() => void)[]>([])
  const redoCallbacks = ref<(() => void)[]>([])

  const onUndo = (callback: () => void) => {
    undoCallbacks.value = [...undoCallbacks.value, callback]
    return () => {
      undoCallbacks.value = undoCallbacks.value.filter(cb => cb !== callback)
    }
  }

  const onRedo = (callback: () => void) => {
    redoCallbacks.value = [...redoCallbacks.value, callback]
    return () => {
      redoCallbacks.value = redoCallbacks.value.filter(cb => cb !== callback)
    }
  }

  const undo = () => {
    workflowHistoryStore.undo()
    undoCallbacks.value.forEach(callback => callback())
  }

  const redo = () => {
    workflowHistoryStore.redo()
    redoCallbacks.value.forEach(callback => callback())
  }

  // Some events may be triggered multiple times in a short period of time.
  // We debounce the history state update to avoid creating multiple history states
  // with minimal changes.
  const saveStateToHistoryRef = debounce((event: WorkflowHistoryEventT, meta?: WorkflowHistoryEventMeta) => {
    const nodes = unref(store.getNodes)
    const edges = unref(store.getEdges)
    workflowHistoryStore.addHistory(cloneDeep({
      workflowHistoryEvent: event,
      workflowHistoryEventMeta: meta,
      nodes: nodes,
      edges: edges,
    }))
  }, 500)

  const saveStateToHistory = (event: WorkflowHistoryEventT, meta?: WorkflowHistoryEventMeta) => {
    switch (event) {
      case WorkflowHistoryEvent.NoteChange:
        // Hint: Note change does not trigger when note text changes,
        // because the note editors have their own history states.
        saveStateToHistoryRef(event, meta)
        break
      case WorkflowHistoryEvent.NodeTitleChange:
      case WorkflowHistoryEvent.NodeDescriptionChange:
      case WorkflowHistoryEvent.NodeDragStop:
      case WorkflowHistoryEvent.NodeChange:
      case WorkflowHistoryEvent.NodeConnect:
      case WorkflowHistoryEvent.NodePaste:
      case WorkflowHistoryEvent.NodeDelete:
      case WorkflowHistoryEvent.EdgeDelete:
      case WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
      case WorkflowHistoryEvent.NodeAdd:
      case WorkflowHistoryEvent.NodeResize:
      case WorkflowHistoryEvent.NoteAdd:
      case WorkflowHistoryEvent.LayoutOrganize:
      case WorkflowHistoryEvent.NoteDelete:
        saveStateToHistoryRef(event, meta)
        break
      default:
        // We do not create a history state for every event.
        // Some events of reactflow may change things the user would not want to undo/redo.
        // For example: UI state changes like selecting a node.
        break
    }
  }

  const getHistoryLabel = (event: WorkflowHistoryEventT) => {
    switch (event) {
      case WorkflowHistoryEvent.NodeTitleChange:
        return t('workflow.changeHistory.nodeTitleChange')
      case WorkflowHistoryEvent.NodeDescriptionChange:
        return t('workflow.changeHistory.nodeDescriptionChange')
      case WorkflowHistoryEvent.LayoutOrganize:
      case WorkflowHistoryEvent.NodeDragStop:
        return t('workflow.changeHistory.nodeDragStop')
      case WorkflowHistoryEvent.NodeChange:
        return t('workflow.changeHistory.nodeChange')
      case WorkflowHistoryEvent.NodeConnect:
        return t('workflow.changeHistory.nodeConnect')
      case WorkflowHistoryEvent.NodePaste:
        return t('workflow.changeHistory.nodePaste')
      case WorkflowHistoryEvent.NodeDelete:
        return t('workflow.changeHistory.nodeDelete')
      case WorkflowHistoryEvent.NodeAdd:
        return t('workflow.changeHistory.nodeAdd')
      case WorkflowHistoryEvent.EdgeDelete:
      case WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
        return t('workflow.changeHistory.edgeDelete')
      case WorkflowHistoryEvent.NodeResize:
        return t('workflow.changeHistory.nodeResize')
      case WorkflowHistoryEvent.NoteAdd:
        return t('workflow.changeHistory.noteAdd')
      case WorkflowHistoryEvent.NoteChange:
        return t('workflow.changeHistory.noteChange')
      case WorkflowHistoryEvent.NoteDelete:
        return t('workflow.changeHistory.noteDelete')
      default:
        return 'Unknown Event'
    }
  }

  // 这个初始化方式目前有个时机问题，过早会造成初始节点宽高数据未保存
  const refreshHistoryList = () => {
    const nodes = cloneDeep(unref(store.getNodes))
    const edges = cloneDeep(unref(store.getEdges))
    console.log('nodes', nodes)
    workflowHistoryStore.setHistoryList([{
      nodes: nodes,
      edges: edges,
      workflowHistoryEvent: undefined,
    }])
    workflowHistoryStore.setCurrentHistoryIndex(0)
  }

  return {
    store: workflowHistoryStore,
    saveStateToHistory,
    getHistoryLabel,
    undo,
    redo,
    onUndo,
    onRedo,
    refreshHistoryList
  }
}