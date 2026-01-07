import {
  useVueFlow,
} from '@vue-flow/core'
import { useWorkflowInstance } from './use-workflow-instance'
import { useNodesSyncDraft } from './use-nodes-sync-draft'
import { api } from '@/api'
import { ElMessageBox } from 'element-plus'
import { WorkflowRunningStatus } from '@/types/workflow'

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

    workflowStore.setWorkflowIsRunning(true)
    const res = await api.workflow.run(params)
    workflowStore.setWorkflowIsRunning(false)
    ElMessageBox.alert(JSON.stringify(res), '运行结果', {
      showConfirmButton: false,
      showCancelButton: false,
      type: 'success',
    })
    return res
  }

  const handleStopRun = async (taskId: string) => {
    return await api.workflow.stop(taskId)
  }

  return {
    handleRun,
    handleStopRun,
  }
}
