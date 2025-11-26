import { useVueFlow } from '@vue-flow/core'
import { computed } from 'vue'
import { useWorkflow, useWorkflowVariables, useWorkflowInstance } from '@/components/workflow/hooks'
import type { ValueSelector } from '@/types'
import { VarType } from '@/types'
import { ref } from 'vue'

type Params = {
  nodeId: string
  isInIteration: boolean
  isInLoop: boolean
}
const useIsVarFileAttribute = ({
  nodeId,
  isInIteration,
  isInLoop,
}: Params) => {
  const isChatMode = ref(false)
  const { instanceId } = useWorkflowInstance()
  const store = useVueFlow(instanceId)
  const { getBeforeNodesInSameBranch } = useWorkflow()
  const {
    nodes,
  } = store
  const currentNode = nodes.value.find(n => n.id === nodeId)
  const iterationNode = isInIteration ? nodes.value.find(n => n.id === currentNode!.parentNode) : null
  const loopNode = isInLoop ? nodes.value.find(n => n.id === currentNode!.parentNode) : null
  const availableNodes = computed(() => {
    return getBeforeNodesInSameBranch(nodeId)
  })
  const { getCurrentVariableType } = useWorkflowVariables()
  const getIsVarFileAttribute = (variable: ValueSelector) => {
    if (variable.length !== 3)
      return false
    const parentVariable = variable.slice(0, 2)
    const varType = getCurrentVariableType({
      parentNode: isInIteration ? iterationNode : loopNode,
      valueSelector: parentVariable,
      availableNodes: availableNodes.value,
      isChatMode: isChatMode.value,
      isConstant: false,
    })
    return varType === VarType.file
  }
  return {
    getIsVarFileAttribute,
  }
}

export default useIsVarFileAttribute
