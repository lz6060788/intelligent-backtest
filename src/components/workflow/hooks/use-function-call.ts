import { storeToRefs } from 'pinia'
import { useNodesInteractions, useAvailableBlocks, useWorkflowInstance, useEdgeInteractions } from '.'
import { useVueFlow } from '@vue-flow/core'
import type { CallExternalCapabilitiesTool, FunctionCallAction } from '@/components/aime/type'
import { BlockEnum } from '@/types'
import { unref, type Ref } from 'vue'
import { MAIN_WORKFLOW_APP_ID } from '@/components/workflow-app/constant'
import { useWorkflowAppStore } from '@/components/workflow-app/store'

export const enum FunctionCallName {
  GetWorkflowInfo = 'getWorkflowInfo',
  AddNode = 'addNode',
  DeleteNode = 'deleteNode',
  EditNode = 'editNode',
  ConnectNode = 'connectNode',
  SwitchWorkflow = 'switchWorkflow',
  CloseWorkflow = 'closeWorkflow',
  DeleteEdge = 'DeleteEdge',
}

export const useFunctionCall = (payload: Ref<{ isCalculator: boolean, workflowId: string }>) => {
  const { availableNodesType } = useAvailableBlocks()

  const callExternalCapabilitiesTools = [
    // 数据查询
    {
      type: 'function',
      function: {
        name: FunctionCallName.GetWorkflowInfo,
        description: '获取当前工作流数据，包含节点数据、边数据',
        parameters: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      tool_id: '456'
    },
    // 节点添加
    {
      type: 'function',
      function: {
        name: FunctionCallName.AddNode,
        description: '添加节点',
        parameters: {
          type: 'object',
          properties: {
            nodeType: {
              type: 'string',
              description: '节点类型',
              enum: availableNodesType,
            },
            prevNodeId: {
              type: 'string',
              description: '前一个节点ID',
            },
            prevNodeSourceHandle: {
              type: 'string',
              description: '前一个节点连线起点ID',
            },
            nextNodeId: {
              type: 'string',
              description: '下一个节点ID',
            },
            nextNodeTargetHandle: {
              type: 'string',
              description: '下一个节点连线终点ID',
            },
          },
          required: ['nodeType'],
        },
      },
      tool_id: '456'
    },
    // 节点删除
    {
      type: 'function',
      function: {
        name: FunctionCallName.DeleteNode,
        description: '删除节点',
        parameters: {
          type: 'object',
          properties: {
            nodeId: {
              type: 'string',
              description: '节点ID',
            },
          },
          required: ['nodeId'],
        },
      },
      tool_id: '456'
    },
    // 节点编辑
    {
      type: 'function',
      function: {
        name: FunctionCallName.EditNode,
        description: '编辑节点，当需要编辑节点时，使用此能力',
        parameters: {
          type: 'object',
          properties: {
            nodeId: {
              type: 'string',
              description: '节点ID',
            },
            data: {
              type: 'object',
              description: '更新后的节点数据',
            },
          },
          required: ['nodeId', 'data'],
        },
      },
      tool_id: '456'
    },
    // 切换工作流
    {
      type: 'function',
      function: {
        name: FunctionCallName.SwitchWorkflow,
        description: '打开或者切换工作流，当需要编辑其他工作流时，使用此能力，切换时会自动保存当前工作流数据',
        parameters: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: `若为算子工作流，则传入所属算子概览节点的节点id，若为主工作流，则传入${MAIN_WORKFLOW_APP_ID}`,
            },
          },
          required: ['id'],
        },
      },
      tool_id: '456'
    },
    // 关闭工作流
    {
      type: 'function',
      function: {
        name: FunctionCallName.CloseWorkflow,
        description: '关闭工作流，当需要关闭工作流时，使用此能力，主工作流无法关闭',
        parameters: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: '传入所属算子概览节点的节点id',
            },
          },
          required: ['id'],
        },
      },
      tool_id: '456'
    },
    // 连接节点
    {
      type: 'function',
      function: {
        name: FunctionCallName.ConnectNode,
        description: '连接节点',
        parameters: {
          type: 'object',
          properties: {
            source: {
              type: 'string',
              description: '源节点ID',
            },
            sourceHandle: {
              type: 'string',
              description: '源节点连线起点ID，默认值为source',
            },
            target: {
              type: 'string',
              description: '目标节点ID',
            },
            targetHandle: {
              type: 'string',
              description: '目标节点连线终点ID，默认值为target',
            },
          },
          required: ['source', 'sourceHandle', 'target', 'targetHandle'],
        },
      },
      tool_id: '456'
    },
    // 断开节点
    {
      type: 'function',
      function: {
        name: FunctionCallName.DeleteEdge,
        description: '删除连线',
        parameters: {
          type: 'object',
          properties: {
            edgeId: {
              type: 'string',
              description: '连线ID',
            },
          },
          required: ['edgeId'],
        },
      },
      tool_id: '456'
    },
  ] as const satisfies CallExternalCapabilitiesTool[]

  /** 查询画布数据具体方法，会过滤算子概览节点数据 */
  const callGetWorkflowInfo = () => {
    const store = useVueFlow(payload.value.workflowId)
    const { nodes, edges } = store
    return {
      nodes: unref(nodes).map((node) => ({
        id: node.id,
        data: node.type === BlockEnum.CalculatorOverview ? node.data : null,
        position: node.position,
        parentNode: node.parentNode,
        type: node.type,
        width: node.width,
        height: node.height,
      })),
      edges: unref(edges).map((edge)  => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        data: edge.data,
      })),
    }
  }

  const callAddNode = (data: {nodeType: BlockEnum, prevNodeId?: string, prevNodeSourceHandle?: string, nextNodeId?: string, nextNodeTargetHandle?: string}) => {
    const { handleNodeAdd } = useNodesInteractions(payload.value.workflowId)
    const { nodeType, prevNodeId, prevNodeSourceHandle, nextNodeId, nextNodeTargetHandle } = data
    return handleNodeAdd(
      {
        nodeType,
      },
      {
        prevNodeId,
        prevNodeSourceHandle,
        nextNodeId,
        nextNodeTargetHandle,
      },
    )
  }

  const callDeleteNode = ({ nodeId }: { nodeId: string }) => {
    const { handleNodeDelete } = useNodesInteractions(payload.value.workflowId)
    return handleNodeDelete(nodeId)
  }

  const callEditNode = ({ nodeId, data }: { nodeId: string, data: any }) => {
    const { updateNodeData } = useVueFlow(payload.value.workflowId)
    return updateNodeData(nodeId, { data })
  }

  const callConnectNode = ({ source, sourceHandle, target, targetHandle }: { source: string, sourceHandle: string, target: string, targetHandle: string }) => {
    const { handleNodeConnect } = useNodesInteractions(payload.value.workflowId)
    return handleNodeConnect({ source, sourceHandle, target, targetHandle })
  }

  const callSwitchWorkflow = ({ id }: { id: string }) => {
    const { openNewWorkflow } = useWorkflowAppStore()
    return openNewWorkflow(id)
  }

  const callCloseWorkflow = ({ id }: { id: string }) => {
    const { removeWorkflow } = useWorkflowAppStore()
    return removeWorkflow(id)
  }

  const callDeleteEdge = ({ edgeId }: { edgeId: string }) => {
    const { handleEdgeDelete } = useEdgeInteractions(payload.value.workflowId)
    return handleEdgeDelete(edgeId)
  }

  const functionCallMap = {
    [FunctionCallName.GetWorkflowInfo]: callGetWorkflowInfo,
    [FunctionCallName.AddNode]: callAddNode,
    [FunctionCallName.DeleteNode]: callDeleteNode,
    [FunctionCallName.SwitchWorkflow]: callSwitchWorkflow,
    [FunctionCallName.CloseWorkflow]: callCloseWorkflow,
    [FunctionCallName.EditNode]: callEditNode,
    [FunctionCallName.ConnectNode]: callConnectNode,
    [FunctionCallName.DeleteEdge]: callDeleteEdge,
  } as const satisfies Record<FunctionCallName, (...args: any[]) => any>

  return {
    callExternalCapabilitiesTools,
    callGetWorkflowInfo,
    functionCallMap,
  }
}
