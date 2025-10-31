import type { AxiosRequestConfig, CancelTokenSource } from 'axios';

// 基础HTTP方法类型
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 全局默认配置项
export interface GlobalConfig {
  baseURL: string; // 基础URL
  timeout: number; // 超时时间（毫秒）
  headers: Record<string, string>; // 默认请求头
  showLoading: boolean; // 默认是否显示加载状态
  ignoreError: boolean; // 默认是否忽略错误提示
}

// 单个接口的配置项（继承全局配置并支持覆盖）
export interface ApiItemConfig {
  url: string; // 接口路径
  method: ApiMethod; // 请求方法
  headers?: Record<string, string>; // 接口级请求头（覆盖全局）
  timeout?: number; // 接口级超时时间（覆盖全局）
  showLoading?: boolean; // 接口级加载状态（覆盖全局）
  ignoreError?: boolean; // 接口级错误忽略（覆盖全局）
  cancelTokenSource?: CancelTokenSource; // 取消信号源（用于取消请求）
}

// API配置结构类型（支持嵌套模块）
export interface ApiConfigStructure {
  [key: string]: ApiItemConfig | ApiConfigStructure;
}

// 最终API调用函数的参数类型
export interface ApiCallParams<Data = any> {
  dataOrParams?: Data; // 请求数据（GET用params，其他用data）
  config?: Partial<Omit<ApiItemConfig, 'url' | 'method'>>; // 调用时覆盖的配置
}
