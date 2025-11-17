import useNodeInfo from './use-node-info.ts'
import {
  useWorkflow,
  useWorkflowVariables,
} from '@/components/workflow/hooks'
import type { NodeOutPutVar } from '@/types'
import { BlockEnum, type Node, type ValueSelector, type Var } from '@/types'

type Params = {
  onlyLeafNodeVar?: boolean
  hideEnv?: boolean
  hideChatVar?: boolean
  filterVar: (payload: Var, selector: ValueSelector) => boolean
  passedInAvailableNodes?: Node[]
}

const useAvailableVarList = (nodeId: string, {
  onlyLeafNodeVar,
  filterVar,
  hideEnv,
  hideChatVar,
  passedInAvailableNodes,
}: Params = {
  onlyLeafNodeVar: false,
  filterVar: () => true,
}) => {
  const { getTreeLeafNodes, getNodeById, getBeforeNodesInSameBranchIncludeParent } = useWorkflow()
  const { getNodeAvailableVars } = useWorkflowVariables()
  const isChatMode = false
  const availableNodes = passedInAvailableNodes || (onlyLeafNodeVar ? getTreeLeafNodes(nodeId) : getBeforeNodesInSameBranchIncludeParent(nodeId))
  const {
    parentNode: parentNode,
  } = useNodeInfo(nodeId)

  const currNode = getNodeById(nodeId)
  const isDataSourceNode = currNode?.data?.type === BlockEnum.DataSource
  const dataSourceRagVars: NodeOutPutVar[] = []
  const availableVars = [...getNodeAvailableVars({
    parentNode: parentNode,
    beforeNodes: availableNodes,
    isChatMode,
    filterVar,
    hideEnv,
    hideChatVar,
  }), ...dataSourceRagVars]
  console.log(availableNodes, parentNode, availableVars)

  return {
    availableVars,
    availableNodes,
    availableNodesWithParent: [
      ...availableNodes,
      ...(isDataSourceNode ? [currNode] : []),
    ],
  }
}

export default useAvailableVarList
