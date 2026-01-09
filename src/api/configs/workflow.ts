import { defineApiItem } from '../types';
import type {
  WorkflowRunParamsType,
} from './workflow.types';

export default {
  run: defineApiItem<any, WorkflowRunParamsType>({
    url: '/quantitative/flow/draft/run?debug=1',
    method: 'POST',
  }),
  stop: defineApiItem<any>({
    url: '/quantitative/flow/draft/stop',
    method: 'POST',
  }),
  graph2graph: defineApiItem<any>({
    url: '/ast2graph/v1/g2g',
    method: 'POST',
  }),
} as const;
