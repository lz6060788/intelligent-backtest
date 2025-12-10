import type { CommonNodeType, WorkflowGraph } from '@/types'

export type CalculatorOverviewNodeType = CommonNodeType & {
  graph: WorkflowGraph
}
