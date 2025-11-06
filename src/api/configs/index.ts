import type { GlobalConfig, ApiConfigStructure } from '../types';
import user from './user';
import workflow from './workflow';

// 1. 全局默认配置
export const GLOBAL_CONFIG: GlobalConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000, // 全局默认超时15秒
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'X-Platform': 'web',
    'X-Version': '1.0.0',
  },
  showLoading: true, // 默认显示加载状态
  ignoreError: false, // 默认不忽略错误提示
};

export const API_CONFIG = {
  user,
  workflow
} as const satisfies ApiConfigStructure;
