import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { BlockEnum, type WorkflowGraph } from '@/types';
import { MAIN_WORKFLOW_APP_ID } from '@/components/workflow-app/constant';
import { useVueFlow } from '@vue-flow/core';
import { transformGraphNodesToNodes, transformGraphEdgesToEdges } from '@/components/workflow/utils';
import type { OperatorOverviewNodeType } from '@/components/workflow/nodes/operator-overview/types';
import { ElNotification } from 'element-plus';

export type WorkflowItem = {
  id: string;
  isOperator: boolean;
  name: string;
  graph: WorkflowGraph;
}

export const useWorkflowAppStore = defineStore('workflow-app', () => {

  const appId = ref('');
  const appDetail = ref<any>({});

  const setAppId = (id: string) => {
    appId.value = id;
  }

  const setAppDetail = (detail: any) => {
    appDetail.value = detail;
  }

  const workflowList = ref<WorkflowItem[]>([
    {
      id: MAIN_WORKFLOW_APP_ID,
      name: '主流程图',
      graph: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 0.4 } },
      isOperator: false,
    },
  ]);
  const removeWorkflow = (id: string) => {
    const index = workflowList.value.findIndex(workflow => workflow.id === id);
    if (activeWorkflowId.value === id) {
      changeActiveWorkflowId(workflowList.value[index - 1]!.id);
    }
    workflowList.value = workflowList.value.filter(workflow => workflow.id !== id);
  }
  const openNewWorkflow = (id: string, name?: string) => {
    if (workflowList.value.find(workflow => workflow.id === id)) {
      changeActiveWorkflowId(id);
      return
    }
    const vueflow = useVueFlow(MAIN_WORKFLOW_APP_ID);
    const { nodes } = vueflow;
    const node = nodes.value.find(node => node.id === id);
    if (!node) {
      ElNotification.error('节点不存在');
      throw new Error('节点不存在');
    } else if (node.data.type !== BlockEnum.OperatorOverview) {
      ElNotification.error('该节点不是算子概览节点，无法展开');
      throw new Error('该节点不是算子概览节点，无法展开');
    }
    const workflow = {
      id,
      name: name || node.data.title,
      graph: (node.data as OperatorOverviewNodeType).graph,
      isOperator: true,
    }
    workflowList.value.push(workflow);
    changeActiveWorkflowId(id);
  }

  // 由于画布切换，vueflow实例会销毁，因此需要在切换之前需要当前画布的信息
  const _updateWorkflow = (id: string) => {
    const vueflow = useVueFlow(id);
    const { nodes, edges, viewport } = vueflow;
    const workflow = workflowList.value.find(workflow => workflow.id === id);
    if (workflow) {
      workflow.graph = { nodes: nodes.value, edges: edges.value, viewport: viewport.value };
      // 当算子工作流切换时，需要将工作流数据同步至主流程图中
      if (workflow.isOperator) {
        const graph = {
          nodes: transformGraphNodesToNodes(nodes.value),
          edges: transformGraphEdgesToEdges(edges.value),
          viewport: viewport.value,
        }
        const mainWorkflow = workflowList.value.find(workflow => workflow.id === MAIN_WORKFLOW_APP_ID);
        if (mainWorkflow && mainWorkflow.graph.nodes.length) {
          mainWorkflow.graph.nodes.forEach((node: any) => {
            if (node.id === id) {
              node.data = {
                ...node.data,
                graph: graph
              }
            }
          });
        }
      }
    }
  }

  const activeWorkflowId = ref<string | typeof MAIN_WORKFLOW_APP_ID>(MAIN_WORKFLOW_APP_ID);
  const changeActiveWorkflowId = (id: string | typeof MAIN_WORKFLOW_APP_ID) => {
    _updateWorkflow(activeWorkflowId.value);
    activeWorkflowId.value = id;
  }

  const activeWorkflow = computed(() => {
    return workflowList.value.find(workflow => workflow.id === activeWorkflowId.value);
  })

  return {
    appId,
    appDetail,
    setAppId,
    setAppDetail,
    workflowList,
    removeWorkflow,
    openNewWorkflow,
    activeWorkflowId,
    changeActiveWorkflowId,
    activeWorkflow,
  }
})
