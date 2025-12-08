import { BlockEnum } from '@/types'
import { useNodesMetaData } from './use-nodes-meta-data.ts'

/** 这里拓展特殊节点类型；若基础节点配置来自于服务端，这里需要改为响应式 */
const availableBlocksFilter = (nodeType: BlockEnum, inContainer?: boolean) => {
  if (inContainer && (nodeType === BlockEnum.Loop || nodeType === BlockEnum.End || nodeType === BlockEnum.DataSource))
    return false

  if (!inContainer && nodeType === BlockEnum.LoopEnd)
    return false

  return true
}

export const useAvailableBlocks = (nodeType?: BlockEnum, inContainer?: boolean) => {
  const {
    nodes: availableNodes,
  } = useNodesMetaData()
  const availableNodesType = availableNodes.map(node => node.metaData.type)
  const availablePrevBlocks = () => {
    if (!nodeType || nodeType === BlockEnum.Start || nodeType === BlockEnum.DataSource)
      return []

    if (nodeType === BlockEnum.Calculator)
      return [BlockEnum.Calculator]

    return availableNodesType.filter(nType => nType !== BlockEnum.Calculator)
  }
  const availableNextBlocks = () => {
    if (!nodeType || nodeType === BlockEnum.End || nodeType === BlockEnum.LoopEnd)
      return []

    if (nodeType === BlockEnum.Calculator)
      return [BlockEnum.Calculator]

    return availableNodesType
  }

  const getAvailableBlocks = (nodeType?: BlockEnum, inContainer?: boolean) => {
    let availablePrevBlocks = availableNodesType
    if (!nodeType || nodeType === BlockEnum.Start || nodeType === BlockEnum.DataSource)
      availablePrevBlocks = []

    let availableNextBlocks = availableNodesType
    if (!nodeType || nodeType === BlockEnum.End || nodeType === BlockEnum.LoopEnd)
      availableNextBlocks = []

    if (nodeType === BlockEnum.Calculator)
      availableNextBlocks = [BlockEnum.Calculator]

    if (nodeType === BlockEnum.Calculator)
      availablePrevBlocks = [BlockEnum.Calculator]

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
