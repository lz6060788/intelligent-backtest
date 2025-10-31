import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { GLOBAL_CONFIG } from './configs';
import type { GlobalConfig, ApiItemConfig, ApiCallParams } from './types';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    showLoading?: boolean; // 自定义加载状态
    ignoreError?: boolean; // 自定义错误忽略
  }
}

// 定义API响应结构
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 创建axios实例
const createAxiosInstance = (globalConfig: GlobalConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: globalConfig.baseURL,
    timeout: globalConfig.timeout,
    headers: globalConfig.headers,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 合并全局与接口的加载状态配置
      const showLoading = config.showLoading !== undefined 
        ? config.showLoading 
        : globalConfig.showLoading;

      // 显示加载状态（实际项目可替换为UI组件）
      if (showLoading) {
        // console.log('加载中...');
      }

      // 添加token（排除不需要token的接口）
      if (!config.headers['X-No-Token']) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error: AxiosError) => {
      console.error('请求拦截错误:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { config, data } = response;
      const showLoading = config.showLoading !== undefined 
        ? config.showLoading 
        : globalConfig.showLoading;

      // 关闭加载状态
      if (showLoading) {
        // console.log('加载完成');
      }

      // 业务错误处理
      if (!data.success) {
        const ignoreError = config.ignoreError !== undefined 
          ? config.ignoreError 
          : globalConfig.ignoreError;

        // 401未登录处理
        if (data.code === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }

        // 非忽略错误时提示
        if (!ignoreError) {
          console.error('业务错误:', data.message);
        }
        return Promise.reject(new Error(data.message || '请求失败'));
      }

      return data.data;
    },
    (error: AxiosError) => {
      const { config } = error;
      if (!config) return Promise.reject(error);

      const showLoading = config.showLoading !== undefined 
        ? config.showLoading 
        : globalConfig.showLoading;

      // 关闭加载状态
      if (showLoading) {
        // console.log('加载完成');
      }

      // 网络错误处理
      const ignoreError = config.ignoreError !== undefined 
        ? config.ignoreError 
        : globalConfig.ignoreError;

      if (!ignoreError) {
        if (axios.isCancel(error)) {
          console.log('请求已取消:', error.message);
        } else if (error.message.includes('timeout')) {
          console.error('请求超时，请重试');
        } else if (error.message.includes('Network Error')) {
          console.error('网络异常，请检查网络');
        } else {
          console.error('请求错误:', error.message);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// 创建实例并导出基础请求方法
const instance = createAxiosInstance(GLOBAL_CONFIG);

// 合并配置（全局配置 + 接口配置 + 调用时配置）
const mergeConfigs = (
  global: GlobalConfig,
  apiItem: ApiItemConfig,
  callConfig?: Partial<ApiItemConfig>
) => {
  return {
    url: apiItem.url,
    method: apiItem.method,
    timeout: callConfig?.timeout || apiItem.timeout || global.timeout,
    headers: { ...global.headers, ...apiItem.headers, ...callConfig?.headers },
    showLoading: callConfig?.showLoading ?? apiItem.showLoading ?? global.showLoading,
    ignoreError: callConfig?.ignoreError ?? apiItem.ignoreError ?? global.ignoreError,
    cancelToken: callConfig?.cancelTokenSource?.token || apiItem.cancelTokenSource?.token,
  };
};

// 基础请求方法
export const baseRequest = async <Res = any, Data = any>(
  apiItem: ApiItemConfig,
  { dataOrParams, config }: ApiCallParams<Data> = {}
): Promise<Res> => {
  // 合并所有配置
  const mergedConfig = mergeConfigs(GLOBAL_CONFIG, apiItem, config);
  
  // GET/DELETE用params，其他用data
  const isGet = ['GET', 'DELETE'].includes(mergedConfig.method);
  return instance({
    ...mergedConfig,
    [isGet ? 'params' : 'data']: dataOrParams,
  });
};
