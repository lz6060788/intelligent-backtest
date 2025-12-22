import type { CommonNodeType, InputVar, WorkflowGraph, ValueSelector } from '@/types'

export type OperatorOverviewNodeType = CommonNodeType & {
  inputs: Record<string, ValueSelector>;
  graph: WorkflowGraph
}
