import type {
  Node,
  WorkflowRunningData,
} from '@/types'
// import type { FileUploadConfigResponse } from '@/models/common'
import { ref } from 'vue'

type PreviewRunningData = WorkflowRunningData & {
  resultTabActive?: boolean
  resultText?: string
}

export type WorkflowSliceShape = {
  workflowRunningData?: PreviewRunningData
  setWorkflowRunningData: (workflowData: PreviewRunningData) => void
  clipboardElements: Node[]
  setClipboardElements: (clipboardElements: Node[]) => void
  selection: null | { x1: number; y1: number; x2: number; y2: number }
  setSelection: (selection: WorkflowSliceShape['selection']) => void
  bundleNodeSize: { width: number; height: number } | null
  setBundleNodeSize: (bundleNodeSize: WorkflowSliceShape['bundleNodeSize']) => void
  controlMode: 'pointer' | 'hand'
  setControlMode: (controlMode: WorkflowSliceShape['controlMode']) => void
  mousePosition: { pageX: number; pageY: number; elementX: number; elementY: number }
  setMousePosition: (mousePosition: WorkflowSliceShape['mousePosition']) => void
  showConfirm?: { title: string; desc?: string; onConfirm: () => void }
  setShowConfirm: (showConfirm: WorkflowSliceShape['showConfirm']) => void
  // controlPromptEditorRerenderKey: number
  // setControlPromptEditorRerenderKey: (controlPromptEditorRerenderKey: number) => void
  // showImportDSLModal: boolean
  // setShowImportDSLModal: (showImportDSLModal: boolean) => void
  // fileUploadConfig?: FileUploadConfigResponse
  // setFileUploadConfig: (fileUploadConfig: FileUploadConfigResponse) => void
}

export const createWorkflowSlice = () => {
  const workflowRunningData = ref();
  const setWorkflowRunningData = (val: WorkflowSliceShape['workflowRunningData']) => workflowRunningData.value = val;
  const clipboardElements = ref<Node[]>([]);
  const setClipboardElements = (val: WorkflowSliceShape['clipboardElements']) => clipboardElements.value = val;
  const selection = ref<WorkflowSliceShape['selection']>(null);
  const setSelection = (val: WorkflowSliceShape['selection']) => selection.value = val;
  const bundleNodeSize = ref<WorkflowSliceShape['bundleNodeSize']>(null);
  const setBundleNodeSize = (val: WorkflowSliceShape['bundleNodeSize']) => bundleNodeSize.value = val;
  const controlMode = ref(localStorage.getItem('workflow-operation-mode') === 'pointer' ? 'pointer'  : 'hand');
  const setControlMode = (val: WorkflowSliceShape['controlMode']) => {
    controlMode.value = val
    localStorage.setItem('workflow-operation-mode', val);
  };
  const mousePosition = ref<WorkflowSliceShape['mousePosition']>({ pageX: 0, pageY: 0, elementX: 0, elementY: 0 });
  const setMousePosition = (val: WorkflowSliceShape['mousePosition']) => mousePosition.value = val;
  const showConfirm = ref<WorkflowSliceShape['showConfirm']>();
  const setShowConfirm = (val: WorkflowSliceShape['showConfirm']) => showConfirm.value = val;
  // const controlPromptEditorRerenderKey = ref<WorkflowSliceShape['controlPromptEditorRerenderKey']>(0);
  // const setControlPromptEditorRerenderKey = (val: WorkflowSliceShape['controlPromptEditorRerenderKey']) => controlPromptEditorRerenderKey.value = val;
  // const showImportDSLModal = ref(false);
  // const setShowImportDSLModal = (val: WorkflowSliceShape['showImportDSLModal']) => showImportDSLModal.value = true;
  // const fileUploadConfig = ref();
  // const setFileUploadConfig = (val: WorkflowSliceShape['fileUploadConfig']) => fileUploadConfig.value = val;

  return {
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
