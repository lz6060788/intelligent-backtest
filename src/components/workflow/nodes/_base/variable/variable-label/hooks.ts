import { computed } from 'vue'
import { 
  isConversationVar,
  isENV,
  isRagVariableVar,
  isSystemVar,
} from '../utils'
import { VarInInspectType } from '@/types/workflow'

// 定义图标组件 - 使用 UnoCSS 图标类名
const Variable02Icon = 'i-ri-variable-2-line'
const BubbleXIcon = 'i-ri-bubble-x-line'
const EnvIcon = 'i-ri-environment-line'
const LoopIcon = 'i-ri-loop-line'
const InputFieldIcon = 'i-ri-input-field-line'

export const useVarIcon = (variables: string[], variableCategory?: VarInInspectType | string): string => {
  if (variableCategory === 'loop')
    return LoopIcon

  if (variableCategory === 'rag' || isRagVariableVar(variables))
    return InputFieldIcon

  if (isENV(variables) || variableCategory === VarInInspectType.environment || variableCategory === 'environment')
    return EnvIcon

  if (isConversationVar(variables) || variableCategory === VarInInspectType.conversation || variableCategory === 'conversation')
    return BubbleXIcon

  return Variable02Icon
}

export const useVarColor = (
  variables: string[], 
  isExceptionVariable?: boolean, 
  variableCategory?: VarInInspectType | string
) => {
  return computed(() => {
    if (isExceptionVariable)
      return 'text-text-warning'

    if (variableCategory === 'loop')
      return 'text-util-colors-cyan-cyan-500'

    if (isENV(variables) || variableCategory === VarInInspectType.environment || variableCategory === 'environment')
      return 'text-util-colors-violet-violet-600'

    if (isConversationVar(variables) || variableCategory === VarInInspectType.conversation || variableCategory === 'conversation')
      return 'text-util-colors-teal-teal-700'

    return 'text-text-accent'
  })
}

export const useVarName = (variables: string[], notShowFullPath?: boolean) => {
  return computed(() => {
    let variableFullPathName = variables.slice(1).join('.')

    if (isRagVariableVar(variables))
      variableFullPathName = variables.slice(2).join('.')

    const variablesLength = variables.length
    const isSystem = isSystemVar(variables)
    const varName = notShowFullPath ? variables[variablesLength - 1] : variableFullPathName
    return `${isSystem ? 'sys.' : ''}${varName}`
  })
}

export const useVarBgColorInEditor = (variables: string[], hasError?: boolean) => {
  if (hasError) {
    return {
      hoverBorderColor: 'hover:border-state-destructive-active',
      hoverBgColor: 'hover:bg-state-destructive-hover',
      selectedBorderColor: '!border-state-destructive-solid',
      selectedBgColor: '!bg-state-destructive-hover',
    }
  }

  if (isENV(variables)) {
    return {
      hoverBorderColor: 'hover:border-util-colors-violet-violet-100',
      hoverBgColor: 'hover:bg-util-colors-violet-violet-50',
      selectedBorderColor: 'border-util-colors-violet-violet-600',
      selectedBgColor: 'bg-util-colors-violet-violet-50',
    }
  }

  if (isConversationVar(variables)) {
    return {
      hoverBorderColor: 'hover:border-util-colors-teal-teal-100',
      hoverBgColor: 'hover:bg-util-colors-teal-teal-50',
      selectedBorderColor: 'border-util-colors-teal-teal-600',
      selectedBgColor: 'bg-util-colors-teal-teal-50',
    }
  }

  return {
    hoverBorderColor: 'hover:border-state-accent-alt',
    hoverBgColor: 'hover:bg-state-accent-hover',
    selectedBorderColor: 'border-state-accent-solid',
    selectedBgColor: 'bg-state-accent-hover',
  }
}
