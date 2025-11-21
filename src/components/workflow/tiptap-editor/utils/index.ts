import { variableTransformer } from '../../utils/variable'
import { isConversationVar, isENV, isSystemVar } from '../../nodes/_base/variable/utils'
import type { ValueSelector } from '@/types'

export const decodeNode = (variable: string) => {
  const variables = variableTransformer(variable) as ValueSelector
  return genNodeAttrs(variables)
}

export const genNodeAttrs = (variables: ValueSelector) => {
  const isEnv = isENV(variables)
  const isChatVar = isConversationVar(variables)
  const isSysVar = isSystemVar(variables)
  const varType = isEnv ? 'env' : isChatVar ? 'conversation' : isSysVar ? 'system' : 'variable'
  return {
    id: variableTransformer(variables),
    label: variables.join('.'),
    varType: varType
  }
}