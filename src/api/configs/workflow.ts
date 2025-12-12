import { defineApiItem } from '../types';
import type {
  WorkflowRunParamsType,
} from './workflow.types';

export default {
  run: defineApiItem<any, WorkflowRunParamsType>({
    url: '/quantitativee/flow/draft/run?debug=1',
    method: 'POST',
  }),
  stop: defineApiItem<any>({
    url: '/quantitativee/flow/draft/stop',
    method: 'POST',
  }),
} as const;
