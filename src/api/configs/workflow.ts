import { defineApiItem } from '../types';
import type {
  DataSourceListResponse,
} from './workflow.types';
import type { ToolWithProvider } from '@/components/workflow/block-selector/types';

export default {
  // 获取所有内置工具
  getAllBuiltInTools: defineApiItem<ToolWithProvider[]>({
    url: '/workflow/builtin-tools',
    method: 'GET',
  }),

  // 获取所有自定义工具
  getAllCustomTools: defineApiItem<ToolWithProvider[]>({
    url: '/workflow/custom-tools',
    method: 'GET',
  }),

  // 获取所有工作流工具
  getAllWorkflowTools: defineApiItem<ToolWithProvider[]>({
    url: '/workflow/workflow-tools',
    method: 'GET',
  }),

  // 获取所有MCP工具
  getAllMCPTools: defineApiItem<ToolWithProvider[]>({
    url: '/workflow/mcp-tools',
    method: 'GET',
  }),

  // 获取数据源列表
  getAllDataSourceList: defineApiItem<DataSourceListResponse>({
    url: '/workflow/data-source-list',
    method: 'GET',
  }),
} as const;
