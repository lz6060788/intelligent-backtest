import { API_CONFIG } from './configs';
import { baseRequest } from './request';
import type { ApiConfigStructure, ApiCallParams, ApiItemConfig } from './types';

const isApiItemConfig = (value: any): value is ApiItemConfig => {
  return value && typeof value === 'object' && 'url' in value && 'method' in value;
};

export type ResType<T> = {
  status_code: number;
  process_info: Record<string, unknown>;
  response: T;
  cost_time: number;
  status_msg: string;
  [index: string]: unknown;
}

// 根据配置项生成类型化的API调用函数
type ApiFuncType<T extends ApiItemConfig> = T extends ApiItemConfig<infer Res, infer Data>
  ? (
      dataOrParams?: ApiCallParams<Data>['dataOrParams'],
      config?: ApiCallParams<Data>['config']
    ) => Promise<ResType<Res>>
  : (
      dataOrParams?: ApiCallParams<any>['dataOrParams'],
      config?: ApiCallParams<any>['config']
    ) => Promise<ResType<any>>;

// 递归生成API调用函数（与配置结构一致）
type ApiService<T> = {
  [K in keyof T]: T[K] extends ApiItemConfig<any, any>
    ? // 接口配置项 -> 生成类型化的请求函数
      ApiFuncType<T[K]>
    : T[K] extends ApiConfigStructure
    ? // 嵌套模块 -> 递归生成服务
      ApiService<T[K]>
    : never;
};

// 生成API服务的函数（添加更严格的类型约束）
const createApiService = <T extends ApiConfigStructure>(config: T): ApiService<T> => {
  const service = {} as ApiService<T>;

  (Object.keys(config) as (keyof T)[]).forEach((key) => {
    const value = config[key];

    if (isApiItemConfig(value)) {
      // 处理接口配置项（叶子节点）
      // 移除运行时不存在的 _res 和 _data 字段
      const { _res, _data, ...cleanConfig } = value as any;

      service[key] = (async (data?: any, callConfig?: any) => {
        return baseRequest(cleanConfig, { dataOrParams: data, config: callConfig });
      }) as ApiService<T>[typeof key];
    } else {
      // 处理嵌套模块（递归）
      service[key] = createApiService(value as ApiConfigStructure) as ApiService<T>[typeof key];
    }
  });

  return service;
};

// 导出最终的API服务
export const api = createApiService(API_CONFIG);
