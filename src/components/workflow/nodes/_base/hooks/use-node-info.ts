import { useVueFlow } from '@vue-flow/core'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'

const useNodeInfo = (nodeId: string, workflowInstanceId?: string) => {
  const { instanceId } = useWorkflowInstance(workflowInstanceId)
  const store = useVueFlow(instanceId)
  const {
    getNodes: allNodes,
  } = store
  const node = allNodes.value.find(n => n.id === nodeId)
  const isInIteration = !!node?.data.isInIteration
  const isInLoop = !!node?.data.isInLoop
  const parentNodeId = node?.parentNode
  const parentNode = allNodes.value.find(n => n.id === parentNodeId)
  return {
    node,
    isInIteration,
    isInLoop,
    parentNode,
  }
}

export default useNodeInfo
