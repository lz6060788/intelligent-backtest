import { computed } from 'vue'
import { useWorkflow } from '../../hooks'
import type { ValueSelector } from '@/types'
import { VarType } from '@/types'
import { getVarType } from '../_base/variable/utils'
import { useWorkflowStore } from '@/components/workflow/store'

/**
 * 参数类型定义
 */
type Params = {
  /** 节点ID */
  nodeId: string
}

/**
 * 判断变量是否为文件属性的composable
 * @param params 参数对象
 */
const useIsVarFileAttribute = ({
  nodeId,
}: Params) => {
  const workflowStore = useWorkflowStore()
  const isChatMode = computed(() => false) // TODO: 实现真正的聊天模式检查
  
  const { getBeforeNodesInSameBranch } = useWorkflow()
  
  const availableNodes = computed(() => {
    return getBeforeNodesInSameBranch(nodeId)
  })
  
  const getIsVarFileAttribute = (variable: ValueSelector) => {
    if (variable.length !== 3)
      return false
    
    const parentVariable = variable.slice(0, 2)
    
    try {
      const varType = getVarType({
        valueSelector: parentVariable,
        availableNodes: availableNodes.value,
        isChatMode: isChatMode.value,
        isConstant: false,
        environmentVariables: [],
        conversationVariables: workflowStore.conversationVariables || [],
      })
      return varType === VarType.file
    } catch {
      return false
    }
  }
  
  return {
    getIsVarFileAttribute,
  }
}

export default useIsVarFileAttribute
