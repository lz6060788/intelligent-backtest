import type { CommonNodeType, Var } from '@/types'

export type OperatorStartNodeType = CommonNodeType & {
  variables: Var[]
}
