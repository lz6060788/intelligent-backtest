import type { CommonNodeType, Var } from '@/types'

export type CalculatorStartNodeType = CommonNodeType & {
  variables: Var[]
}
