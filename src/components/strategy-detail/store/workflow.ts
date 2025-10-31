import { defineStore } from "pinia"
import { ref, computed } from "vue"

export type WorkflowMainState = {
  appId: string
  appName: string
  nodesDefaultConfigs: Record<string, any>
  setNodesDefaultConfigs: (nodesDefaultConfigs: Record<string, any>) => void
}

export const useWorkflowStore = defineStore('workflow-main', () => {
  const appId = ref('');
  const appName = ref('');
  const nodesDefaultConfigs = ref({});
  const setNodesDefaultConfigs = (config: Record<string, any>) => {
    nodesDefaultConfigs.value = config;
  }

  return {
    appId,
    appName,
    setNodesDefaultConfigs
  }
});
