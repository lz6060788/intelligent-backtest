import { useWorkflowStore } from '../store'
import { inject, onUnmounted } from 'vue'

/**
 * 流程图实例管理 Hook
 * @param instanceId 实例唯一标识符，通常使用 WorkflowProps.id
 */
export function useWorkflowInstance(instanceId?: string) {
  const store = useWorkflowStore()
  // TODO 临时代码
  instanceId = instanceId || inject('workflowInstanceId') as string

  // 初始化实例
  const instance = store.initInstance(instanceId)

  if (!instance) {
    throw new Error(`Failed to initialize workflow instance: ${instanceId}`)
  }

  const cleanInstance = () => {
    store.destroyInstance(instanceId)
  }

  // 返回当前实例的状态和操作方法
  return {
    instanceId,
    instance,
    cleanInstance,
  }
}
