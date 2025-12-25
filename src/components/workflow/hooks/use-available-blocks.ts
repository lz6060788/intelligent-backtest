import { BlockEnum } from '@/types'
import { useNodesMetaData } from './use-nodes-meta-data.ts'

/** 这里拓展特殊节点类型；若基础节点配置来自于服务端，这里需要改为响应式 */
const availableBlocksFilter = (nodeType: BlockEnum, inContainer?: boolean) => {
  if (inContainer && (nodeType === BlockEnum.Loop || nodeType === BlockEnum.Iteration || nodeType === BlockEnum.End || nodeType === BlockEnum.DataSource))
    return false

  if (!inContainer && nodeType === BlockEnum.LoopEnd)
    return false

  return true
}

export const useAvailableBlocks = (nodeType?: BlockEnum, inContainer?: boolean, workflowId?: string) => {
  const {
    nodes: availableNodes,
  } = useNodesMetaData(workflowId)
  const availableNodesType = availableNodes.map(node => node.metaData.type)
  const availablePrevBlocks = () => {
    if (!nodeType || nodeType === BlockEnum.Start || nodeType === BlockEnum.DataSource || nodeType === BlockEnum.OperatorStart)
      return []

    if (nodeType === BlockEnum.Operator)
      return [BlockEnum.Operator]
    if (nodeType === BlockEnum.OperatorEnd)
      return [BlockEnum.Operator]

    return availableNodesType.filter(nType => nType !== BlockEnum.Operator)
  }
  const availableNextBlocks = () => {
    if (!nodeType || nodeType === BlockEnum.End || nodeType === BlockEnum.LoopEnd || nodeType === BlockEnum.OperatorEnd)
      return []

    if (nodeType === BlockEnum.Operator)
      return [BlockEnum.Operator, BlockEnum.OperatorEnd]
    if (nodeType === BlockEnum.OperatorStart)
      return [BlockEnum.Operator]

    return availableNodesType
  }

  const getAvailableBlocks = (nodeType?: BlockEnum, inContainer?: boolean) => {
    let availablePrevBlocks = availableNodesType
    if (!nodeType || nodeType === BlockEnum.Start || nodeType === BlockEnum.DataSource || nodeType === BlockEnum.OperatorStart)
      availablePrevBlocks = []

    let availableNextBlocks = availableNodesType
    if (!nodeType || nodeType === BlockEnum.End || nodeType === BlockEnum.LoopEnd || nodeType === BlockEnum.OperatorEnd)
      availableNextBlocks = []

    if (nodeType === BlockEnum.Operator)
      availableNextBlocks = [BlockEnum.Operator, BlockEnum.OperatorEnd]
    if (nodeType === BlockEnum.OperatorStart)
      availableNextBlocks = [BlockEnum.Operator]

    if (nodeType === BlockEnum.Operator)
      availablePrevBlocks = [BlockEnum.Operator]
    if (nodeType === BlockEnum.OperatorEnd)
      availablePrevBlocks = [BlockEnum.Operator]

    return {
      availablePrevBlocks: availablePrevBlocks.filter(nType => availableBlocksFilter(nType, inContainer)),
      availableNextBlocks: availableNextBlocks.filter(nType => availableBlocksFilter(nType, inContainer)),
    }
  }

  return {
    availableNodesType,
    getAvailableBlocks,
    availablePrevBlocks: availablePrevBlocks().filter(nType => availableBlocksFilter(nType, inContainer)),
    availableNextBlocks: availableNextBlocks().filter(nType => availableBlocksFilter(nType, inContainer)),
  }
}
