import { BlockEnum, VarType, type Edge, type Node } from '@/types'
import { OperatorOutputValueTypeEnum, type OperatorNodeType } from '../operator/types'
import { operators } from '../operator/constant/operators'

export const getOutputVars = (nodes: Node[], edges: Edge[]) => {
  const endNode = nodes.find(node => node.data!.type === BlockEnum.OperatorEnd)
  if (!endNode) return []
  const connectedEdges = edges.filter(edge => edge.target === endNode.id)
  const incomers = nodes.filter(node => connectedEdges.some(edge => edge.source === node.id)).filter((node) => !!(node.data as OperatorNodeType)?.alias)
  return incomers.map((node) => {
    const operator = operators.find(operator => operator.name === (node.data as OperatorNodeType).operator)
    return {
      alias: (node.data as OperatorNodeType).alias,
      ...operator?.output,
    }
  })
}

export const transformVarType = (type: OperatorOutputValueTypeEnum) => {
  switch (type) {
    case OperatorOutputValueTypeEnum.FLOAT:
      return VarType.number
    case OperatorOutputValueTypeEnum.BOOL:
      return VarType.boolean
    case OperatorOutputValueTypeEnum.INT:
      return VarType.integer
    case OperatorOutputValueTypeEnum.NUMBER:
      return VarType.number
    case OperatorOutputValueTypeEnum.ANY:
    default:
      return VarType.any
  }
}