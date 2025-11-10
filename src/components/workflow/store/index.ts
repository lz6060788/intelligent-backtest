import { defineStore } from 'pinia';
import { createNodeSlice } from './nodes-slice';
import { createWorkflowSlice } from './workflow-slice';
import { createEnvVariableSlice } from './env-variable-slice';
import { createWorkflowHistorySlice } from './workflow-history-slice';
import type { WorkflowSliceShape } from './workflow-slice';
import type { NodeSliceShape } from './nodes-slice';
import type { EnvVariableSliceShape } from './env-variable-slice';
import type { WorkflowHistorySliceShape } from './workflow-history-slice';
import { reactive, type Reactive, type Ref } from 'vue';

/**
 * 单个流程图实例的完整状态
 */
type WorkflowInstanceState =
  & WorkflowSliceShape
  & NodeSliceShape
  & EnvVariableSliceShape
  & WorkflowHistorySliceShape

export const useWorkflowStore = defineStore('workflow-ui', () => {
  // 使用 Map 存储每个实例的状态，key 为 instanceId
  const instances = new Map<string, WorkflowInstanceState>()

  /**
   * 获取或创建实例状态
   */
  const getOrCreateInstance = (instanceId: string): WorkflowInstanceState => {
    if (!instances.has(instanceId)) {
      instances.set(instanceId, {
        ...createNodeSlice(),
        ...createWorkflowSlice(),
        ...createEnvVariableSlice(),
        ...createWorkflowHistorySlice(),
      })
    }
    return instances.get(instanceId)!
  }

  /**
   * 初始化实例
   */
  const initInstance = (instanceId: string) => {
    return getOrCreateInstance(instanceId)
  }

  /**
   * 销毁实例
   */
  const destroyInstance = (instanceId: string) => {
    instances.delete(instanceId)
  }


  return {
    // 实例管理方法
    instances,
    initInstance,
    destroyInstance,
  }
})
