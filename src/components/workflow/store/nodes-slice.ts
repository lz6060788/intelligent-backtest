import type { Node } from '@/types'
import { ref, type Ref } from 'vue'

type NodeMenu = {
  top: number
  left: number
  nodeId: string
}

type ConnectionNodePayload = { nodeId: string; nodeType: string; handleType: string; handleId: string | null }

type EnteringNodePayload = {
  nodeId: string
  nodeData: any
}

export type NodeSliceShape = {
  showSingleRunPanel: Ref<boolean>
  setShowSingleRunPanel: (val: boolean) => void
  nodeAnimation: Ref<boolean>
  setNodeAnimation: (val: boolean) => void
  candidateNode: Ref<Node | undefined>
  setCandidateNode: (val?: Node) => void
  nodeMenu: Ref<NodeMenu | undefined>
  setNodeMenu: (val?: NodeMenu) => void
  showAssignVariablePopup: Ref<any>
  setShowAssignVariablePopup: (val: any) => void
  hoveringAssignVariableGroupId: Ref<any>
  setHoveringAssignVariableGroupId: (val: any) => void
  connectingNodePayload: Ref<ConnectionNodePayload | undefined>
  setConnectingNodePayload: (val?: ConnectionNodePayload) => void
  enteringNodePayload: Ref<EnteringNodePayload | undefined>
  setEnteringNodePayload: (val?: EnteringNodePayload) => void
}

export const createNodeSlice = () => {
  const showSingleRunPanel = ref(false)
  /** 控制animation样式，需要在拖拽时去除该样式 */
  const nodeAnimation = ref(false)
  const candidateNode = ref<Node | undefined>(undefined)
  const nodeMenu = ref<NodeMenu | undefined>(undefined)
  // 设置赋值变量
  const showAssignVariablePopup = ref(undefined)
  // 变量聚合器分组悬停的groupId
  const hoveringAssignVariableGroupId = ref(undefined)
  /** connect-start 设置的Node */
  const connectingNodePayload = ref<ConnectionNodePayload | undefined>(undefined)
  const enteringNodePayload = ref<EnteringNodePayload | undefined>(undefined)
  // const iterTimes = ref(1)
  // const loopTimes = ref(1)
  // const iterParallelLogMap = ref(new Map<string, Map<string, NodeTracing[]>>())

  return {
    showSingleRunPanel,
    nodeAnimation,
    candidateNode,
    nodeMenu,
    showAssignVariablePopup,
    hoveringAssignVariableGroupId,
    connectingNodePayload,
    enteringNodePayload,
    // iterTimes,
    // loopTimes,
    // iterParallelLogMap,
    setShowSingleRunPanel: (val: boolean) => { showSingleRunPanel.value = val },
    setNodeAnimation: (val: boolean) => { nodeAnimation.value = val },
    setCandidateNode: (val?: Node) => { candidateNode.value = val },
    setNodeMenu: (val?: NodeMenu) => { nodeMenu.value = val },
    setShowAssignVariablePopup: (val: any) => { showAssignVariablePopup.value = val },
    setHoveringAssignVariableGroupId: (val: any) => { hoveringAssignVariableGroupId.value = val },
    setConnectingNodePayload: (val?: ConnectionNodePayload) => { connectingNodePayload.value = val },
    setEnteringNodePayload: (val?: EnteringNodePayload) => { enteringNodePayload.value = val },
    // setIterTimes: (val: number) => { iterTimes.value = val },
    // setLoopTimes: (val: number) => { loopTimes.value = val },
    // setIterParallelLogMap: (val: Map<string, Map<string, NodeTracing[]>>) => { iterParallelLogMap.value = val },
  }
}
