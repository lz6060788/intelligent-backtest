import { defineStore } from 'pinia';
import { createNodeSlice } from './nodes-slice';
import { createWorkflowSlice } from './workflow-slice';

export const useWorkflowStore = defineStore('workflow-ui', () => {
  return {
    ...createNodeSlice(),
    ...createWorkflowSlice(),
  }
})
