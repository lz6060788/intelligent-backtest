import type {
  BlockEnum,
  VarType,
} from '@/types'

export type VariablePayload = {
  className?: string
  nodeType?: BlockEnum
  nodeTitle?: string
  variables: string[]
  variableType?: VarType
  onClick?: (e: MouseEvent) => void
  errorMsg?: string
  isExceptionVariable?: boolean
  notShowFullPath?: boolean
  rightSlot?: any // Vue slot
}
