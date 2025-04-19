import axiosInstance from './axios';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RefreshTokenRequest, 
  RefreshTokenResponse,
  User
} from '@/types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login/', data);
    return response.data;
  },
  
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/register/', data);
    return response.data;
  },
  
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post('/auth/refresh_token/', data);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout/');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me/');
    return response.data;
  },
  
  verifyEmail: async (token: string): Promise<void> => {
    await axiosInstance.post('/auth/verify-email/', { token });
  },
  
  requestPasswordReset: async (email: string): Promise<void> => {
    await axiosInstance.post('/auth/request-password-reset/', { email });
  },
  
  resetPassword: async (token: string, password: string): Promise<void> => {
    await axiosInstance.post('/auth/reset-password/', { token, password });
  },
  
  changePassword: async (old_password: string, new_password: string): Promise<void> => {
    await axiosInstance.post('/auth/change-password/', { old_password, new_password });
  }
};