import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { WorkflowGraph } from '@/types';
import { MAIN_WORKFLOW_APP_ID } from '@/components/workflow-app/constant';
import { useVueFlow } from '@vue-flow/core';

export type WorkflowItem = {
  id: string;
  isCalculator: boolean;
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
      isCalculator: false,
    },
  ]);
  const removeWorkflow = (id: string) => {
    const index = workflowList.value.findIndex(workflow => workflow.id === id);
    workflowList.value = workflowList.value.filter(workflow => workflow.id !== id);
    if (activeWorkflowId.value === id) {
      activeWorkflowId.value = workflowList.value[index - 1]!.id;
    }
  }
  const openNewWorkflow = (id: string, name: string, graph: WorkflowGraph) => {
    const workflow = {
      id,
      name,
      graph,
      isCalculator: true,
    }
    if (workflowList.value.find(workflow => workflow.id === id)) {
      return;
    } else {
      workflowList.value.push(workflow);
    }
    changeActiveWorkflowId(id);
  }

  // 由于画布切换，vueflow实例会销毁，因此需要在切换之前需要当前画布的信息
  const _updateWorkflow = (id: string) => {
    const vueflow = useVueFlow(id);
    const { nodes, edges, viewport } = vueflow;
    const workflow = workflowList.value.find(workflow => workflow.id === id);
    if (workflow) {
      workflow.graph = { nodes: nodes.value, edges: edges.value, viewport: viewport.value };
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
