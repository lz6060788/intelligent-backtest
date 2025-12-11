import { defineApiItem } from '../types';
import type {
  WorkflowRunParamsType,
} from './workflow.types';

export default {
  run: defineApiItem<any, WorkflowRunParamsType>({
    url: '/workflow/run',
    method: 'POST',
  }),
} as const;
