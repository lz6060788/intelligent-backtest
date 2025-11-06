// 用户相关接口的类型定义

// 用户信息响应类型
export interface UserInfoResponse {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  user: UserInfoResponse;
  expiresIn: number;
}

// 更新用户信息请求类型
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

// 更新用户信息响应类型
export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user: UserInfoResponse;
}

// 删除用户响应类型
export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

