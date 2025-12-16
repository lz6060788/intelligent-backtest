import type { CommonNodeType, WorkflowGraph } from '@/types'

export type OperatorOverviewNodeType = CommonNodeType & {
  graph: WorkflowGraph
}
