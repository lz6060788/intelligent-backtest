import { storeToRefs } from "pinia";
import {
  useNodesInteractions,
  useAvailableBlocks,
  useEdgeInteractions,
  useWorkflowStartRun,
  useWorkflowOrganize,
} from ".";
import { getConnectedEdges, useVueFlow, type Connection } from "@vue-flow/core";
import type {
  CallExternalCapabilitiesTool,
  FunctionCallContext,
} from "@/components/aime/type";
import { BlockEnum } from "@/types";
import { unref, type Ref } from "vue";
import { MAIN_WORKFLOW_APP_ID } from "@/components/workflow-app/constant";
import { useWorkflowAppStore } from "@/components/workflow-app/store";
import {
  transformGraphNodesToNodes,
  transformGraphEdgesToEdges,
} from "../utils";
import { useNodeLoopInteractions } from "../nodes/loop/use-interactions";

export const enum FunctionCallName {
  GetWorkflowInfo = "get_workflow_info",
  GetNodesInfo = "get_node_info",
  UpdateNodeConfig = "update_node_config",
  SetNodeConnections = "set_node_connections",
  DeleteNodes = "delete_nodes",
  CreateNodes = "create_nodes",
  SetNodeScopes = "set_node_scopes",
  WorkflowTabAction = "workflow_tab_action",
  RunWorkflow = "run_workflow",
  BeautifyWorkflow = "beautify_workflow",
  // ConnectNode = 'connectNode',
  // DeleteEdge = 'DeleteEdge',
}

export const useFunctionCall = (
  payload: Ref<{ isOperator: boolean; workflowId: string }>
) => {
  const callExternalCapabilitiesTools = [
    // get_workflow_info
    {
      type: "function",
      function: {
        name: FunctionCallName.GetWorkflowInfo,
        description: "用于获取当前工作流完整的nodes和edges的关系",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      tool_id: "456",
    },
    // get_node_info
    {
      type: "function",
      function: {
        name: FunctionCallName.GetNodesInfo,
        description: "用于获取指定工作流节点的完整信息，如连接关系，配置等",
        parameters: {
          type: "object",
          properties: {
            nodeIds: {
              type: "array",
              description: "节点ID列表",
              items: {
                type: "string",
                description: "节点ID",
                minItems: 1,
              },
            },
          },
          required: ["nodeIds"],
        },
      },
      tool_id: "456",
    },
    // update_node_config
    {
      type: "function",
      function: {
        name: FunctionCallName.UpdateNodeConfig,
        description: "用于更新具体节点的配置信息",
        parameters: {
          type: "object",
          properties: {
            nodeId: {
              type: "string",
              description: "节点ID",
            },
            data: {
              type: "string",
              description:
                "stringified config reasoned according to the `node config schema` collect via `get_node_template`",
            },
          },
          required: ["nodeId", "data"],
        },
      },
      tool_id: "456",
    },
    // set_node_connections
    {
      type: "function",
      function: {
        name: FunctionCallName.SetNodeConnections,
        description: "用于更新节点间的连接关系（edges），其支持部分与全局更新",
        parameters: {
          type: "object",
          properties: {
            connections: {
              type: "array",
              description: "需要替换的连接关系列表",
              items: {
                type: "object",
                description: "连接关系",
                properties: {
                  source: {
                    type: "object",
                    description: "source node",
                    properties: {
                      nodeId: {
                        type: "string",
                        description: "node id of source node",
                      },
                      handle: {
                        type: "string",
                        description: "handle id of source node",
                      },
                    },
                    required: ["nodeId"],
                    additionalProperties: false,
                  },
                  target: {
                    type: "object",
                    description: "target node",
                    properties: {
                      nodeId: {
                        type: "string",
                        description: "node id of target node",
                      },
                      handle: {
                        type: "string",
                        description: "handle id of target node",
                      },
                    },
                    required: ["nodeId"],
                    additionalProperties: false,
                  },
                },
                required: ["source", "taeget"],
                additionalProperties: false,
              },
              minItems: 1,
            },
          },
          required: ["connections"],
        },
      },
      tool_id: "456",
    },
    // delete_nodes
    {
      type: "function",
      function: {
        name: FunctionCallName.DeleteNodes,
        description: "用于在workflow页面中删除节点",
        parameters: {
          type: "object",
          properties: {
            nodeIds: {
              type: "array",
              description: "节点ID列表",
              items: {
                type: "string",
                description: "节点ID",
                minItems: 1,
              },
            },
          },
          required: ["nodeIds"],
        },
      },
      tool_id: "456",
    },
    // create_nodes
    {
      type: "function",
      function: {
        name: FunctionCallName.CreateNodes,
        description: "用于在workflow页面中添加节点",
        parameters: {
          type: "object",
          properties: {
            nodes: {
              type: "array",
              description: "节点列表",
              items: {
                type: "object",
                description: "一个节点",
                properties: {
                  nodeType: {
                    type: "string",
                    description: "节点类型",
                    enum: [
                      "start",
                      "if-else",
                      "code",
                      "http-request",
                      "loop-start",
                      "loop",
                      "loop-end",
                      "llm",
                      "variable-aggregator",
                      "end",
                      "operator-overview",
                    ],
                  },
                },
                required: ["nodeType"],
              },
            },
          },
          required: ["nodes"],
        },
      },
      tool_id: "456",
    },
    // set_node_scopes
    {
      type: "function",
      function: {
        name: "set_node_scopes",
        description:
          "用于设定节点的作用域（Scope），如置于工作流主图中，或至于带有body的节点中",
        parameters: {
          type: "object",
          properties: {
            assignments: {
              type: "array",
              description: "待分配节点列表",
              items: {
                type: "object",
                description: "一个待分配节点",
                properties: {
                  nodeIds: {
                    type: "array",
                    description: "待分配节点ID列表",
                    items: {
                      type: "string",
                      description: "待分配节点ID",
                    },
                    minItems: 1,
                  },
                  scope: {
                    type: "object",
                    description: "作用域类别",
                    properties: {
                      type: {
                        type: "string",
                        description: "作用域类别",
                        enum: ["workflow", "loop"],
                      },
                      nodeId: {
                        type: "string",
                        description:
                          "当作用域为`workflow`时，无须该信息；当为非`workflow`时，需要提供具体的作用域的node_id",
                      },
                    },
                    required: ["type"],
                    additionalProperties: false,
                  },
                },
                required: ["nodeIds", "scope"],
                additionalProperties: false,
              },
              minItems: 1,
            },
          },
          required: ["assignments"],
          additionalProperties: false,
        },
      },
      tool_id: "456",
    },
    // workflow_tab_action
    {
      type: "function",
      function: {
        name: FunctionCallName.WorkflowTabAction,
        description:
          "用于对workflow studio的页面tab进行操作，即打开、切换、关闭工作流tab。当需要编辑某个工作流，如`主工作流`，`子工作流`时，在操作前应当切换至对应tab，以确保当前的focus页面正确，以确保对具体workflow页面function调用可以顺利执行",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              description: "操作类型",
              enum: ["open", "switch", "close"],
            },
            id: {
              type: "string",
              description:
                "若为算子工作流，则传入所属算子概览节点的节点id，若为主工作流，则传入`main-workflow-app`",
            },
          },
          required: ["action", "id"],
        },
      },
      tool_id: "456",
    },
    // run_workflow
    {
      type: "function",
      function: {
        name: FunctionCallName.RunWorkflow,
        description: "运行当前所打开工作流",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      tool_id: "456",
    },
    // beautify_workflow
    {
      type: "function",
      function: {
        name: FunctionCallName.BeautifyWorkflow,
        description: "用于对workflow进行美化，即自动调整节点位置",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      tool_id: "456",
    },
  ] as const satisfies CallExternalCapabilitiesTool[];

  /** 查询画布数据具体方法，会过滤算子概览节点数据 */
  const callGetWorkflowInfo = () => {
    const store = useVueFlow(payload.value.workflowId);
    const { nodes, edges } = store;
    return {
      nodes: unref(nodes).map((node) => ({
        id: node.id,
        data: node.type !== BlockEnum.OperatorOverview ? node.data : null,
        position: node.position,
        parentNode: node.parentNode,
        type: node.type,
        width: node.width,
        height: node.height,
      })),
      edges: unref(edges).map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        data: edge.data,
      })),
    };
  };

  const callGetNodesInfo = ({ nodeIds }: { nodeIds: string[] }) => {
    const store = useVueFlow(payload.value.workflowId);
    const { nodes } = store;
    return unref(nodes)
      .filter((node) => nodeIds.includes(node.id))
      .map((node) => ({
        id: node.id,
        data: node.type === BlockEnum.OperatorOverview ? null : node.data,
      }));
  };

  const callUpdateNodeConfig = ({
    nodeId,
    data,
  }: {
    nodeId: string;
    data: string;
  }) => {
    const { nodes } = useVueFlow(payload.value.workflowId);
    const targetNode = nodes.value.find((node) => node.id === nodeId);
    if (targetNode) {
      targetNode.data = {
        ...targetNode.data,
        ...JSON.parse(data),
      };
    }
    return true;
  };

  const callSetNodeConnections = ({
    connections,
  }: {
    connections: {
      source: {
        nodeId: string;
        handle: string;
      };
      target: {
        nodeId: string;
        handle: string;
      };
    }[];
  }) => {
    const { replaceEdges } = useEdgeInteractions(payload.value.workflowId);
    replaceEdges(
      connections.map((i) => ({
        source: i.source.nodeId,
        sourceHandle: i.source.handle,
        target: i.target.nodeId,
        targetHandle: i.target.handle,
      })) as Connection[]
    );
    setTimeout(() => {
      callBeautifyWorkflow();
    }, 1000);
  };

  const callCreateNodes = ({
    nodes,
  }: {
    nodes: {
      nodeType: BlockEnum;
    }[];
  }) => {
    const { handleIsolatedNodeAdd } = useNodesInteractions(
      payload.value.workflowId
    );
    nodes.forEach((node) => {
      const { nodeType } = node;
      if (
        nodeType === BlockEnum.Start ||
        nodeType === BlockEnum.OperatorStart
      ) {
        return;
      }
      return handleIsolatedNodeAdd(nodeType);
    });
    // callBeautifyWorkflow();
  };

  const callDeleteNodes = ({ nodeIds }: { nodeIds: string[] }) => {
    const { handleNodeDelete } = useNodesInteractions(payload.value.workflowId);
    return nodeIds.forEach((nodeId) => handleNodeDelete(nodeId));
  };

  const callSetNodeScopes = ({ assignments }: { assignments: { nodeIds: string[]; scope: { type: "workflow" | "loop"; nodeId: string; } }[] }) => {
    const store = useVueFlow(payload.value.workflowId);
    const { handleNodeLoopRerender } = useNodeLoopInteractions(payload.value.workflowId)
    const { edges } = store;
    assignments.forEach((assignment) => {
      const { nodeIds, scope } = assignment;
      const { handleEdgeDelete } = useEdgeInteractions(payload.value.workflowId);
      const { handleMoveNodeToParent } = useNodesInteractions(payload.value.workflowId);
      nodeIds.forEach((nodeId) => {
        const connectedEdges = getConnectedEdges(nodeId, edges.value)
        connectedEdges.forEach((edge) => handleEdgeDelete(edge.id));
        handleMoveNodeToParent(nodeId, scope.nodeId);
      });
      handleNodeLoopRerender(scope.nodeId);
    });
    // callBeautifyWorkflow();
  }

  const callWorkflowTabAction = ({
    action,
    id,
  }: {
    action: "open" | "switch" | "close";
    id: string;
  }) => {
    const { openNewWorkflow, removeWorkflow } = useWorkflowAppStore();
    return action === "close" ? removeWorkflow(id) : openNewWorkflow(id);
  };

  const callRunWorkflow = async (_: any, context: FunctionCallContext) => {
    const instanceId = payload.value.workflowId;
    const { handleWorkflowStartRun } = useWorkflowStartRun(instanceId);
    const store = useVueFlow(instanceId);
    const { nodes, edges, viewport } = store;
    const res = await handleWorkflowStartRun({
      id: instanceId,
      inputs: {},
      graph: {
        nodes: transformGraphNodesToNodes(nodes.value),
        edges: transformGraphEdgesToEdges(edges.value),
        viewport: viewport.value,
      },
    });
    context.respFunction(true, JSON.stringify(res));
  };

  const callConnectNode = ({
    source,
    sourceHandle,
    target,
    targetHandle,
  }: {
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
  }) => {
    const { handleNodeConnect } = useNodesInteractions(
      payload.value.workflowId
    );
    return handleNodeConnect({ source, sourceHandle, target, targetHandle });
  };

  const callDeleteEdge = ({ edgeId }: { edgeId: string }) => {
    const { handleEdgeDelete } = useEdgeInteractions(payload.value.workflowId);
    return handleEdgeDelete(edgeId);
  };

  const callBeautifyWorkflow = () => {
    const { handleLayout } = useWorkflowOrganize(payload.value.workflowId);
    return handleLayout();
  };

  const functionCallMap = {
    [FunctionCallName.GetWorkflowInfo]: callGetWorkflowInfo,
    [FunctionCallName.GetNodesInfo]: callGetNodesInfo,
    [FunctionCallName.UpdateNodeConfig]: callUpdateNodeConfig,
    [FunctionCallName.SetNodeConnections]: callSetNodeConnections,
    [FunctionCallName.DeleteNodes]: callDeleteNodes,
    [FunctionCallName.CreateNodes]: callCreateNodes,
    [FunctionCallName.SetNodeScopes]: callSetNodeScopes,
    [FunctionCallName.WorkflowTabAction]: callWorkflowTabAction,
    [FunctionCallName.RunWorkflow]: callRunWorkflow,
    [FunctionCallName.BeautifyWorkflow]: callBeautifyWorkflow,
    // [FunctionCallName.ConnectNode]: callConnectNode,
    // [FunctionCallName.DeleteEdge]: callDeleteEdge,
  } as const satisfies Record<
    FunctionCallName,
    (args: any, context: FunctionCallContext) => any
  >;

  // 异步方法（需要用户操作后才有结果）
  const asyncFunctionCalls: FunctionCallName[] = [FunctionCallName.RunWorkflow];

  return {
    callExternalCapabilitiesTools,
    callGetWorkflowInfo,
    functionCallMap,
    asyncFunctionCalls,
  };
};
