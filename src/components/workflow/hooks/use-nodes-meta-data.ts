import { BlockEnum, type NodeDefault } from "@/types"
import { WORKFLOW_COMMON_NODES } from "../constant"

export type AvailableNodesMetaData = {
  nodes: NodeDefault[]
  nodesMap?: Record<BlockEnum, NodeDefault<any>>
}

// 这里需要补充各类节点的基础信息，按需要拓展为通过接口获取
export const useNodesMetaData = () => {
  const availableNodesMetaData = {
    nodes: [],
    nodesMap: {
      [BlockEnum.Start]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.End]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.Loop]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.LoopStart]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.LoopEnd]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.IfElse]: WORKFLOW_COMMON_NODES.ifElseDefault,
      [BlockEnum.Agent]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.DataSource]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.HttpRequest]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.LLM]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.Calculator]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.VariableAggregator]: WORKFLOW_COMMON_NODES.startDefault,
      [BlockEnum.Code]: WORKFLOW_COMMON_NODES.startDefault,
    }
  } as AvailableNodesMetaData

  return availableNodesMetaData
}
