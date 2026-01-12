import { storeToRefs } from "pinia";
import {
  useNodesInteractions,
  useAvailableBlocks,
  useEdgeInteractions,
  useWorkflowStartRun,
  useWorkflowOrganize,
} from ".";
import { getConnectedEdges, useVueFlow, type Connection, type GraphEdge, type ViewportTransform } from "@vue-flow/core";
import type {
  CallExternalCapabilitiesTool,
  FunctionCallContext,
} from "@/components/aime/type";
import { BlockEnum, type GraphNode } from "@/types";
import { unref, type Ref } from "vue";
import { MAIN_WORKFLOW_APP_ID } from "@/components/workflow-app/constant";
import { useWorkflowAppStore } from "@/components/workflow-app/store";
import {
  transformGraphNodesToNodes,
  transformGraphEdgesToEdges,
  transformNodesToSimpleNodes,
  transformEdgesToSimpleEdges,
} from "../utils";
import { useNodeLoopInteractions } from "../nodes/loop/use-interactions";
import { api } from '@/api'
import type { OperatorOverviewNodeType } from "../nodes/operator-overview/types";

export const enum FunctionCallName {
  GetWorkflowInfo = "get_workflow_info",
  GetNodesInfo = "get_node_info",
  UpdateNodeConfig = "update_node_config",
  SetNodeConnections = "set_node_connections",
  DeleteNodes = "delete_nodes",
  CreateNodes = "create_nodes",
  SetNodeScopes = "set_node_scopes",
  WorkflowTabAction = "workflow_tab_action",
  // RunWorkflow = "run_workflow",
  BeautifyWorkflow = "beautify_workflow",
  UpdateCalculatorGraph = "operator_tab_replace",
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
        description: "用于更新节点间的连接关系（edges），仅支持全局更新，即全部节点的连接关系，必须一次性输入",
        parameters: {
          type: "object",
          properties: {
            connections: {
              type: "array",
              description: "全量节点间连接关系列表",
              items: {
                type: "object",
                description: "节点间连接关系",
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
                      "llm",
                      "code",
                      "variable-aggregator",
                      "if-else",
                      "loop",
                      "loop-end",
                      "iteration",
                      "operator-overview",
                      "search",
                      "backtest",
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
    // {
    //   type: "function",
    //   function: {
    //     name: FunctionCallName.RunWorkflow,
    //     description: "运行当前所打开工作流",
    //     parameters: {
    //       type: "object",
    //       properties: {},
    //       required: [],
    //     },
    //   },
    //   tool_id: "456",
    // },
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
    // update_calculator_graph
    {
      type: "function",
      function: {
        name: FunctionCallName.UpdateCalculatorGraph,
        description: "用于整体替换 `operator` tab 画布中的 flow 结构（包括 node 与 edge）。`operator` tab 为 `operator-overview` 的子画布，仅允许使用 `operator` 类型节点构建算子标准化流程。该工具支持 `agent` 与 `tool` 之间的上下文管理，可针对同一 `operator` tab 进行多次连续调整与微调。调用后将直接覆盖当前画布中的全部 node 和 edge，并返回执行结果。",
        parameters: {
            type: "object",
            properties: {
                instruction: {
                    type: "string",
                    description: "用于描述如何更新 `operator` 画布的自然语言指令"
                }
            },
            required: [
                "instruction"
            ],
            additionalProperties: false
        }
      },
      tool_id: "456",
    },
  ] as const satisfies CallExternalCapabilitiesTool[];

  /** 查询画布数据具体方法，会过滤算子概览节点数据 */
  const callGetWorkflowInfo = async () => {
    const store = useVueFlow(payload.value.workflowId);
    const { nodes, edges, viewport } = store;
    if (payload.value.isOperator) {
      try {
        const res = await api.workflow.graph2AST({
          graph: {
            nodes: nodes.value,
            edges: edges.value,
            viewport
          },
        })
        return {
          active_tab: {
              id: payload.value.workflowId,
              tab: payload.value.isOperator ? '算子流程图' : '主流程图'
          },
          workflow_info: res.response
        }
      } catch (error) {
        throw new Error('算子流AST获取失败：' + (error as Error).message)
      }
    }
    else {
      const graphNodes = unref(nodes).map(async (node) => {
        if (node.data.type === BlockEnum.OperatorOverview) {
          try {
            const res = await api.workflow.graph2AST({
              graph: {
                nodes: (node.data as OperatorOverviewNodeType).graph.nodes,
                edges: (node.data as OperatorOverviewNodeType).graph.edges,
                viewport: (node.data as OperatorOverviewNodeType).graph.viewport
              },
            })
            node.data.graph = res.response;
          } catch (error) {
            node.data.graph = null;
          }
        }
        return node;
      });
      return {
        active_tab: {
            id: payload.value.workflowId,
            tab: payload.value.isOperator ? '算子流程图' : '主流程图'
        },
        workflow_info: {
          nodes: transformNodesToSimpleNodes(await Promise.all(graphNodes)),
          edges: transformEdgesToSimpleEdges(edges.value),
        }
      };
    }
  };

  const callGetNodesInfo = async ({ nodeIds }: { nodeIds: string[] }) => {
    const store = useVueFlow(payload.value.workflowId);
    const { nodes } = store;
    const _nodes = unref(nodes)
      .filter((node) => nodeIds.includes(node.id))
      .map(async (node) => {
        if (node.data.type === BlockEnum.OperatorOverview) {
          try {
            const res = await api.workflow.graph2AST({
              graph: {
                nodes: (node.data as OperatorOverviewNodeType).graph.nodes,
                edges: (node.data as OperatorOverviewNodeType).graph.edges,
                viewport: (node.data as OperatorOverviewNodeType).graph.viewport
              },
            })
            node.data.graph = res.response;
          } catch (error) {
            node.data.graph = null;
          }
        }
        return node
      });
    return await Promise.all(_nodes);
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
    return {
      node_type: targetNode?.data.type,
      node_id: targetNode?.id,
      current_config: JSON.stringify(targetNode?.data),
    };
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
    const { edges } = useVueFlow(payload.value.workflowId);
    return {
      current_connections: transformEdgesToSimpleEdges(unref(edges)),
    }
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
    const result = nodes.map((node) => {
      const { nodeType } = node;
      if (
        nodeType === BlockEnum.Start ||
        nodeType === BlockEnum.OperatorStart
      ) {
        return;
      }
      const id = handleIsolatedNodeAdd(nodeType);
      return {
        node_type: nodeType,
        node_id: id
      }
    });
    return {
      created_nodes: result.filter((node) => node?.node_id !== undefined),
    }
    // callBeautifyWorkflow();
  };

  const callDeleteNodes = ({ nodeIds }: { nodeIds: string[] }) => {
    const { handleNodeDelete } = useNodesInteractions(payload.value.workflowId);
    nodeIds.forEach((nodeId) => handleNodeDelete(nodeId));
    const { edges, nodes } = useVueFlow(payload.value.workflowId);
    return {
      current_nodes: transformNodesToSimpleNodes(unref(nodes)),
      current_connections: transformEdgesToSimpleEdges(unref(edges)),
    }
  };

  const callSetNodeScopes = ({ assignments }: { assignments: { nodeIds: string[]; scope: { type: "workflow" | "loop"; nodeId: string; } }[] }) => {
    const store = useVueFlow(payload.value.workflowId);
    assignments.forEach((assignment) => {
      const { nodeIds, scope } = assignment;
      const { handleMoveNodeToParent } = useNodesInteractions(payload.value.workflowId);
      nodeIds.forEach((nodeId) => {
        handleMoveNodeToParent(nodeId, scope.nodeId);
      });
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
    const currentTabId = action === "close" ? removeWorkflow(id) : openNewWorkflow(id);
    if (action === 'open') {
      return `${currentTabId} tab 已经被打开`;
    }
    else if (action === 'switch') {
      return `已切换至 ${currentTabId} tab`;
    }
    else if (action === 'close') {
      return `tab ${id} 已经被关闭, 目前打开的tab为${currentTabId}`;
    }
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
    handleLayout();
    return `${payload.value.workflowId} tab已经美化成功`;
  };

  const callUpdateCalculatorGraph = async ({ instruction }: { instruction: string }) => {
    const { activeWorkflow } = useWorkflowAppStore();
    if (!activeWorkflow) {
      throw new Error('No active workflow found')
    }
    if (!activeWorkflow.isOperator) {
      throw new Error('Active workflow is not an operator workflow')
    }
    const store = useVueFlow(payload.value.workflowId);
    const { nodes, edges, viewport, setNodes, setEdges, setViewport } = store;
    const params = {
      instruction,
      current_graph: {
        graph: {
          nodes: transformGraphNodesToNodes(nodes.value),
          edges: transformGraphEdgesToEdges(edges.value),
          viewport
        }
      },
      operator_graph_id: activeWorkflow.id
    }
    try {
      const res = await api.workflow.graph2graph(params)
      const graph = res.response.response.response.graph;
      if (!graph.nodes.length) {
        throw new Error('No nodes found in the graph')
      }
      setNodes(graph.nodes as GraphNode[]);
      setEdges(graph.edges as GraphEdge[]);
      setViewport(graph.viewport as ViewportTransform);
      return '算子流更新成功'
    } catch (error) {
      throw new Error('算子流更新服务调用失败：' + (error as Error).message)
    }
    // const { handleUpdateCalculatorGraph } = useCalculatorGraph(payload.value.workflowId);
    // return handleUpdateCalculatorGraph(instruction);
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
    // [FunctionCallName.RunWorkflow]: callRunWorkflow,
    [FunctionCallName.BeautifyWorkflow]: callBeautifyWorkflow,
    [FunctionCallName.UpdateCalculatorGraph]: callUpdateCalculatorGraph,
    // [FunctionCallName.ConnectNode]: callConnectNode,
    // [FunctionCallName.DeleteEdge]: callDeleteEdge,
  } as const satisfies Record<
    FunctionCallName,
    (args: any, context: FunctionCallContext) => any
  >;

  // 异步方法（需要用户操作后才有结果）
  const asyncFunctionCalls: FunctionCallName[] = [];

  return {
    callExternalCapabilitiesTools,
    callGetWorkflowInfo,
    functionCallMap,
    asyncFunctionCalls,
  };
};
