import {
  useVueFlow,
} from '@vue-flow/core'
import { useWorkflowInstance } from './use-workflow-instance'
import { useNodesSyncDraft } from './use-nodes-sync-draft'
import { api } from '@/api'

export const useWorkflowRun = (id?: string) => {
  const { instanceId, instance: workflowStore } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)
  const { doSyncWorkflowDraft } = useNodesSyncDraft(instanceId)

  // dify中 该方法会启动sse接口，用于持续获取各节点运行过程，当前先简单实现
  const handleRun = async (
    params: any,
    // 回调用于节点追踪，暂未实现
    callback?: any,
  ) => {
    const {
      nodes,
    } = store
    nodes.value.forEach((node) => {
      node.data.selected = false
      node.data._runningStatus = undefined
    })
    await doSyncWorkflowDraft()

    return await api.workflow.run(params)
  }

  const handleStopRun = async (taskId: string) => {
    return await api.workflow.stop(taskId)
  }

  return {
    handleRun,
    handleStopRun,
  }
}
