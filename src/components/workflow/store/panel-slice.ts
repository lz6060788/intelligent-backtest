import { ref, type Ref } from "vue"

export type PanelSliceShape = {
  panelWidth: Ref<number>
  showFeaturesPanel: Ref<boolean>
  setShowFeaturesPanel: (showFeaturesPanel: boolean) => void
  showWorkflowVersionHistoryPanel: Ref<boolean>
  setShowWorkflowVersionHistoryPanel: (showWorkflowVersionHistoryPanel: boolean) => void
  showInputsPanel: Ref<boolean>
  setShowInputsPanel: (showInputsPanel: boolean) => void
  showDebugAndPreviewPanel: Ref<boolean>
  setShowDebugAndPreviewPanel: (showDebugAndPreviewPanel: boolean) => void
  panelMenu: Ref<{
    top: number
    left: number
  } | undefined>
  setPanelMenu: (panelMenu?: {
    top: number
    left: number
  }) => void
  selectionMenu: Ref<{
    top: number
    left: number
  } | undefined>
  setSelectionMenu: (selectionMenu?: {
    top: number
    left: number
  }) => void
  showVariableInspectPanel: Ref<boolean>
  setShowVariableInspectPanel: (showVariableInspectPanel: boolean) => void
  initShowLastRunTab: Ref<boolean>
  setInitShowLastRunTab: (initShowLastRunTab: boolean) => void
}

export const createPanelSlice = () => {
  const panelWidth = ref(localStorage.getItem('workflow-node-panel-width') ? Number.parseFloat(localStorage.getItem('workflow-node-panel-width')!) : 420);
  const showFeaturesPanel = ref(false);
  const setShowFeaturesPanel = (val: boolean) => { showFeaturesPanel.value = val };
  const showWorkflowVersionHistoryPanel = ref(false);
  const setShowWorkflowVersionHistoryPanel = (val: boolean) => { showWorkflowVersionHistoryPanel.value = val };
  const showInputsPanel = ref(false);
  const setShowInputsPanel = (val: boolean) => { showInputsPanel.value = val };
  const showDebugAndPreviewPanel = ref(false);
  const setShowDebugAndPreviewPanel = (val: boolean) => { showDebugAndPreviewPanel.value = val };
  const panelMenu = ref<{ top: number; left: number } | undefined>();
  const setPanelMenu = (val?: { top: number; left: number }) => { panelMenu.value = val };
  const selectionMenu = ref<{ top: number; left: number } | undefined>();
  const setSelectionMenu = (val?: { top: number; left: number }) => { selectionMenu.value = val };
  const showVariableInspectPanel = ref(false);
  const setShowVariableInspectPanel = (val: boolean) => { showVariableInspectPanel.value = val };
  const initShowLastRunTab = ref(false);
  const setInitShowLastRunTab = (val: boolean) => { initShowLastRunTab.value = val };

  return {
    panelWidth,
    showFeaturesPanel,
    setShowFeaturesPanel,
    showWorkflowVersionHistoryPanel,
    setShowWorkflowVersionHistoryPanel,
    showInputsPanel,
    setShowInputsPanel,
    showDebugAndPreviewPanel,
    setShowDebugAndPreviewPanel,
    panelMenu,
    setPanelMenu,
    selectionMenu,
    setSelectionMenu,
    showVariableInspectPanel,
    setShowVariableInspectPanel,
    initShowLastRunTab,
    setInitShowLastRunTab,
  }
}
