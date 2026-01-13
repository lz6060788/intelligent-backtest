import {
  useVueFlow,
} from '@vue-flow/core'
import { useWorkflowInstance } from './use-workflow-instance'
import { useNodesSyncDraft } from './use-nodes-sync-draft'
import { api } from '@/api'
import { ElMessageBox, ElNotification } from 'element-plus'
import { WorkflowRunningStatus } from '@/types/workflow'
import { h } from 'vue'
import CodeEditor from '@/components/workflow/nodes/_base/editor/code-editor/index.vue'
import { CodeLanguage } from '../nodes/code/types'

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

    try {
      workflowStore.setWorkflowIsRunning(true)
      const res = await api.workflow.run(params)
      ElMessageBox.alert(h(CodeEditor, {
        language: CodeLanguage.json,
        value: JSON.stringify(res.response, null, 2),
        readonly: true,
        height: 600,
        style: {
          width: '800px',
        }
      }), '运行结果', {
        showConfirmButton: false,
        showCancelButton: false,
        type: '',
        customStyle: {
          width: '830px',
          height: '680px',
          maxWidth: '830px',
          maxHeight: '680px',
        },
      })
      return res
    }
    catch (error) {
      ElNotification({
        title: 'Error',
        message: (error as Error).message,
        type: 'error'
      })
      throw error
    }
    finally {
      workflowStore.setWorkflowIsRunning(false)
    }
  }

  const handleStopRun = async (taskId: string) => {
    return await api.workflow.stop(taskId)
  }

  return {
    handleRun,
    handleStopRun,
  }
}

function generateResponseVNodes(res: any) {
  if (!res || typeof res !== 'object' || Object.keys(res).length === 0) {
    return h('p', null, h('span', null, '暂无响应数据'));
  }

  const vnodeList = Object.entries(res).map(([key, value], index) =>
    h('p', { key: index }, [
      h('span', { style: 'font-weight: bold' }, `${key}: `),
      h('i', { style: 'color: teal' }, typeof value === 'object' ? JSON.stringify(value) : String(value))
    ])
  );

  return h('div', null, vnodeList);
}