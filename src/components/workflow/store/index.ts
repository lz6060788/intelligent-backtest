import { defineStore } from 'pinia';
import { createNodeSlice } from './nodes-slice';
import { createWorkflowSlice } from './workflow-slice';
import { createEnvVariableSlice } from './env-variable-slice';

export const useWorkflowStore = defineStore('workflow-ui', () => {
  return {
    ...createNodeSlice(),
    ...createWorkflowSlice(),
    ...createEnvVariableSlice(),
  }
})
