import { defineApiItem } from '../types';
import type {
  UserInfoResponse,
  LoginRequest,
  LoginResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from './user.types';

export default {
  // GET 请求：获取用户信息
  // 使用 defineApiItem 定义类型，第一个泛型是响应类型，第二个是请求类型
  info: defineApiItem<UserInfoResponse>({
    url: '/user/info',
    method: 'GET',
  }),

  // POST 请求：用户登录
  // 定义请求类型和响应类型
  login: defineApiItem<LoginResponse, LoginRequest>({
    url: '/user/login',
    method: 'POST',
  }),

  // PUT 请求：更新用户信息
  update: defineApiItem<UpdateUserResponse, UpdateUserRequest>({
    url: '/user/update',
    method: 'PUT',
  }),

  // DELETE 请求：删除用户
  // 只定义响应类型，没有请求参数
  delete: defineApiItem<DeleteUserResponse>({
    url: '/user/delete',
    method: 'DELETE',
  }),
} as const;
