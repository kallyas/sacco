import Cookies from 'js-cookie';
import { authApi } from '@/api/auth.api';
import { LoginRequest, RegisterRequest, User } from '@/types/auth.types';

const TOKEN_EXPIRY_DAYS = 1; // Access token expiry in days
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // Refresh token expiry in days

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<User> => {
    const response = await authApi.login(credentials);
    
    // Store tokens in cookies
    Cookies.set('access_token', response.tokens.access_token, { 
      expires: TOKEN_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    Cookies.set('refresh_token', response.tokens.refresh_token, { 
      expires: REFRESH_TOKEN_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return response.user;
  },
  
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await authApi.register(data);
    
    // Store tokens in cookies
    Cookies.set('access_token', response.tokens.access_token, { 
      expires: TOKEN_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    Cookies.set('refresh_token', response.tokens.refresh_token, { 
      expires: REFRESH_TOKEN_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return response.user;
  },
  
  logout: async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove tokens from cookies regardless of API success
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  },
  
  refreshToken: async (): Promise<boolean> => {
    const refreshToken = Cookies.get('refresh_token');
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await authApi.refreshToken({ refresh_token: refreshToken });
      
      Cookies.set('access_token', response.tokens.access_token, { 
        expires: TOKEN_EXPIRY_DAYS,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      Cookies.set('refresh_token', response.tokens.refresh_token, { 
        expires: REFRESH_TOKEN_EXPIRY_DAYS,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return false;
    }
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      return await authApi.getCurrentUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  isAuthenticated: (): boolean => {
    return !!Cookies.get('access_token');
  },
  
  getAccessToken: (): string | undefined => {
    return Cookies.get('access_token');
  }
};

export default AuthService;