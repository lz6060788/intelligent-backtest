import { type Edge as VueflowEdge } from '@vue-flow/core'
import type { CommonEdgeType, Edge } from '@/types'

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

export const transformEdgesToSimpleEdges = (edges: VueflowEdge[]): Partial<Edge>[] => {
  return edges.map((edge) => {
    Object.keys(edge.data).forEach((key) => {
      if (key.startsWith('_')) {
        delete (edge.data as CommonEdgeType)[key as keyof CommonEdgeType];
      }
    });
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    };
  });
};