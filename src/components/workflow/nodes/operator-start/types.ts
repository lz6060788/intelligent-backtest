import type { CommonNodeType, Var, InputVar } from '@/types'

export type OperatorStartNodeType = CommonNodeType & {
  inputs: InputVar[],
  variables: Var[]
}
