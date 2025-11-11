import { ref, type Ref } from "vue"

export type LayoutSliceShape = {
  workflowCanvasWidth: Ref<number | undefined>
  workflowCanvasHeight: Ref<number | undefined>
  setWorkflowCanvasWidth: (width: number) => void
  setWorkflowCanvasHeight: (height: number) => void
  // rightPanelWidth - otherPanelWidth = nodePanelWidth
  rightPanelWidth: Ref<number | undefined>
  setRightPanelWidth: (width: number) => void
  nodePanelWidth: Ref<number>
  setNodePanelWidth: (width: number) => void
  previewPanelWidth: Ref<number>
  setPreviewPanelWidth: (width: number) => void
  otherPanelWidth: Ref<number>
  setOtherPanelWidth: (width: number) => void
  bottomPanelWidth: Ref<number> // min-width = 400px; default-width = auto || 480px;
  setBottomPanelWidth: (width: number) => void
  bottomPanelHeight: Ref<number>
  setBottomPanelHeight: (height: number) => void
  variableInspectPanelHeight: Ref<number> // min-height = 120px; default-height = 320px;
  setVariableInspectPanelHeight: (height: number) => void
  maximizeCanvas: Ref<boolean>
  setMaximizeCanvas: (val: boolean) => void
}

export const createLayoutSlice = (): LayoutSliceShape => {
  const workflowCanvasWidth = ref<number | undefined>(undefined)
  const setWorkflowCanvasWidth = (width: number) => workflowCanvasWidth.value = width
  const workflowCanvasHeight = ref<number | undefined>(undefined)
  const setWorkflowCanvasHeight = (height: number) => workflowCanvasHeight.value = height
  const rightPanelWidth = ref<number | undefined>(undefined)
  const setRightPanelWidth = (width: number) => rightPanelWidth.value = width
  const nodePanelWidth = ref<number>(localStorage.getItem('workflow-node-panel-width') ? Number.parseFloat(localStorage.getItem('workflow-node-panel-width')!) : 400)
  const setNodePanelWidth = (width: number) => nodePanelWidth.value = width
  const previewPanelWidth = ref<number>(localStorage.getItem('debug-and-preview-panel-width') ? Number.parseFloat(localStorage.getItem('debug-and-preview-panel-width')!) : 400)
  const setPreviewPanelWidth = (width: number) => previewPanelWidth.value = width
  const otherPanelWidth = ref<number>(400)
  const setOtherPanelWidth = (width: number) => otherPanelWidth.value = width
  const bottomPanelWidth = ref<number>(480)
  const setBottomPanelWidth = (width: number) => bottomPanelWidth.value = width
  const bottomPanelHeight = ref<number>(324)
  const setBottomPanelHeight = (height: number) => bottomPanelHeight.value = height
  const variableInspectPanelHeight = ref<number>(localStorage.getItem('workflow-variable-inpsect-panel-height') ? Number.parseFloat(localStorage.getItem('workflow-variable-inpsect-panel-height')!) : 320)
  const setVariableInspectPanelHeight = (height: number) => variableInspectPanelHeight.value = height
  const maximizeCanvas = ref<boolean>(localStorage.getItem('workflow-canvas-maximize') === 'true')
  const setMaximizeCanvas = (val: boolean) => maximizeCanvas.value = val
  return {
    workflowCanvasWidth,
    setWorkflowCanvasWidth,
    workflowCanvasHeight,
    setWorkflowCanvasHeight,
    rightPanelWidth,
    setRightPanelWidth,
    nodePanelWidth,
    setNodePanelWidth,
    previewPanelWidth,
    setPreviewPanelWidth,
    otherPanelWidth,
    setOtherPanelWidth,
    bottomPanelWidth,
    setBottomPanelWidth,
    bottomPanelHeight,
    setBottomPanelHeight,
    variableInspectPanelHeight,
    setVariableInspectPanelHeight,
    maximizeCanvas,
    setMaximizeCanvas,
  }
}