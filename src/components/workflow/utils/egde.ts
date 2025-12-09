import { type Edge as VueflowEdge } from '@vue-flow/core'
import type { Edge } from '@/types'

export const transformGraphEdgesToEdges = (edges: VueflowEdge[]): Edge[] => {
  return edges.map((edge) => {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      data: edge.data,
      type: edge.type,
      zIndex: edge.zIndex,
    }
  })
}