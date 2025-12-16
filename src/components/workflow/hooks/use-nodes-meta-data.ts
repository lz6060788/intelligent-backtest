import { BlockEnum, type NodeDefault } from "@/types"
import { useAvailableNodesMetaData } from "./use-available-nodes-meta-data"

export type AvailableNodesMetaData = {
  nodes: NodeDefault[]
  nodesMap?: Record<BlockEnum, NodeDefault<any>>
}

// 这里需要补充各类节点的基础信息，按需要拓展为通过接口获取
export const useNodesMetaData = (id?: string) => {

  const availableNodesMetaData = useAvailableNodesMetaData(id)

  return {
    nodes: availableNodesMetaData.nodes.value,
    nodesMap: availableNodesMetaData.nodesMap.value,
  }
}
