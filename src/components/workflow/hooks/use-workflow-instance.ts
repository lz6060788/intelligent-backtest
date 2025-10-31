import type { PreviewRunningData, WorkflowSliceShape } from "../store/workflow-slice"
import { useWorkflowStore } from '../store'
import type { Node } from '@/types'


export function useWorkflowInstance(instanceId: string) {
  const store = useWorkflowStore()
  
  // 初始化实例
  store.initInstance(instanceId)
  
  // 组件卸载时清理实例
  const cleanup = () => {
    store.destroyInstance(instanceId)
  }
  
  // 返回当前实例的状态和操作方法
  return {
    instanceId,
    cleanup,
    get state() {
      return store.getInstanceState(instanceId)
    },
    setWorkflowRunningData: (data: PreviewRunningData) => 
      store.setWorkflowRunningData(instanceId, data),
    setClipboardElements: (elements: Node[]) => 
      store.setClipboardElements(instanceId, elements),
    setSelection: (selection: WorkflowSliceShape['selection']) => 
      store.setSelection(instanceId, selection),
    setBundleNodeSize: (size: WorkflowSliceShape['bundleNodeSize']) => 
      store.setBundleNodeSize(instanceId, size),
    setControlMode: (mode: WorkflowSliceShape['controlMode']) => 
      store.setControlMode(instanceId, mode),
    setMousePosition: (position: WorkflowSliceShape['mousePosition']) => 
      store.setMousePosition(instanceId, position),
    setShowConfirm: (confirm: WorkflowSliceShape['showConfirm']) => 
      store.setShowConfirm(instanceId, confirm)
  }
}
