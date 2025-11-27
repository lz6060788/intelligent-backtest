import { storeToRefs } from 'pinia'
import { useNodesInteractions, useAvailableBlocks, useWorkflowInstance } from '.'
import { useVueFlow } from '@vue-flow/core'
import type { CallExternalCapabilitiesTool, FunctionCallAction } from '@/components/aime/type'
import { BlockEnum } from '@/types'
import { unref } from 'vue'

export const enum FunctionCallName {
  GetWorkflowInfo = 'getWorkflowInfo',
  AddNode = 'addNode',
  DeleteNode = 'deleteNode',
}

export const useFunctionCall = () => {
  const { instanceId,  instance: workflowStore } = useWorkflowInstance()
  const store = useVueFlow(instanceId)
  const { nodes, edges } = store
  const { availableNodesType } = useAvailableBlocks()
  const { handleNodeAdd, handleNodeDelete } = useNodesInteractions()

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
  ] as const satisfies CallExternalCapabilitiesTool[]

  const callGetWorkflowInfo = () => {
    return {
      nodes: unref(nodes).map((node) => ({
        id: node.id,
        data: node.data,
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
    return handleNodeDelete(nodeId)
  }

  const functionCallMap = {
    [FunctionCallName.GetWorkflowInfo]: callGetWorkflowInfo,
    [FunctionCallName.AddNode]: callAddNode,
    [FunctionCallName.DeleteNode]: callDeleteNode,
  } as const satisfies Record<FunctionCallName, (...args: any[]) => any>

  return {
    callExternalCapabilitiesTools,
    callGetWorkflowInfo,
    functionCallMap,
  }
}
