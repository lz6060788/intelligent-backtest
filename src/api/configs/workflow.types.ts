// 工作流相关接口的类型定义

// 工具信息
export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters?: Record<string, any>;
}

// 数据源信息
export interface DataSourceInfo {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  status: 'active' | 'inactive';
}

// 数据源列表响应
export interface DataSourceListResponse {
  dataSources: DataSourceInfo[];
  total: number;
}

