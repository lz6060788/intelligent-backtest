import {
  WorkflowRunningStatus,
  type Node,
  type WorkflowRunningData,
  ControlMode,
} from '@/types'
import { ref, type Ref } from 'vue'
// import type { FileUploadConfigResponse } from '@/models/common'

type PreviewRunningData = WorkflowRunningData & {
  resultTabActive?: boolean
  resultText?: string
}

export type WorkflowSliceShape = {
  workflowIsCalculator: Ref<boolean>
  setWorkflowIsCalculator: (workflowIsCalculator: boolean) => void
  workflowRunningData: Ref<WorkflowRunningData | undefined>
  setWorkflowRunningData: (workflowData?: WorkflowRunningData) => void
  clipboardElements: Ref<Node[]>
  setClipboardElements: (clipboardElements: Node[]) => void
  selection: Ref<null | { x1: number; y1: number; x2: number; y2: number }>
  setSelection: (selection: null | { x1: number; y1: number; x2: number; y2: number }) => void
  bundleNodeSize: Ref<{ width: number; height: number } | null>
  setBundleNodeSize: (bundleNodeSize: { width: number; height: number } | null) => void
  controlMode: Ref<ControlMode>
  setControlMode: (controlMode: ControlMode) => void
  mousePosition: Ref<{ pageX: number; pageY: number; elementX: number; elementY: number }>
  setMousePosition: (mousePosition: { pageX: number; pageY: number; elementX: number; elementY: number }) => void
  showConfirm?: Ref<{ title: string; desc?: string; onConfirm: () => void } | undefined>
  setShowConfirm: (showConfirm: { title: string; desc?: string; onConfirm: () => void } | undefined) => void
  // controlPromptEditorRerenderKey: number
  // setControlPromptEditorRerenderKey: (controlPromptEditorRerenderKey: number) => void
  // showImportDSLModal: boolean
  // setShowImportDSLModal: (showImportDSLModal: boolean) => void
  // fileUploadConfig?: FileUploadConfigResponse
  // setFileUploadConfig: (fileUploadConfig: FileUploadConfigResponse) => void
}

export const createWorkflowSlice = () => {
  const workflowIsCalculator = ref<boolean>(false);
  const setWorkflowIsCalculator = (val: boolean) => workflowIsCalculator.value = val;
  const workflowRunningData = ref<WorkflowRunningData | undefined>();
  const setWorkflowRunningData = (val?: WorkflowRunningData) => workflowRunningData.value = val;
  const clipboardElements = ref<Node[]>([]);
  const setClipboardElements = (val: Node[]) => clipboardElements.value = val;
  const selection = ref<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const setSelection = (val: null | { x1: number; y1: number; x2: number; y2: number }) => selection.value = val;
  const bundleNodeSize = ref<{ width: number; height: number } | null>(null);
  const setBundleNodeSize = (val: { width: number; height: number } | null) => bundleNodeSize.value = val;
  const controlMode = ref<ControlMode>(ControlMode.Hand);
  const setControlMode = (val: ControlMode) => {
    controlMode.value = val
  };
  const mousePosition = ref<{ pageX: number; pageY: number; elementX: number; elementY: number }>({ pageX: 0, pageY: 0, elementX: 0, elementY: 0 });
  const setMousePosition = (val: { pageX: number; pageY: number; elementX: number; elementY: number }) => mousePosition.value = val;
  const showConfirm = ref<{ title: string; desc?: string; onConfirm: () => void } | undefined>();
  const setShowConfirm = (val: { title: string; desc?: string; onConfirm: () => void } | undefined) => showConfirm.value = val;
  // const controlPromptEditorRerenderKey = ref<WorkflowSliceShape['controlPromptEditorRerenderKey']>(0);
  // const setControlPromptEditorRerenderKey = (val: WorkflowSliceShape['controlPromptEditorRerenderKey']) => controlPromptEditorRerenderKey.value = val;
  // const showImportDSLModal = ref(false);
  // const setShowImportDSLModal = (val: WorkflowSliceShape['showImportDSLModal']) => showImportDSLModal.value = true;
  // const fileUploadConfig = ref();
  // const setFileUploadConfig = (val: WorkflowSliceShape['fileUploadConfig']) => fileUploadConfig.value = val;

  return {
    workflowIsCalculator,
    setWorkflowIsCalculator,
    workflowRunningData,
    setWorkflowRunningData,
    clipboardElements,
    setClipboardElements,
    selection,
    setSelection,
    bundleNodeSize,
    setBundleNodeSize,
    controlMode,
    setControlMode,
    mousePosition,
    setMousePosition,
    showConfirm,
    setShowConfirm,
    // controlPromptEditorRerenderKey,
    // setControlPromptEditorRerenderKey,
    // showImportDSLModal,
    // setShowImportDSLModal,
    // fileUploadConfig,
    // setFileUploadConfig,
  }
}
