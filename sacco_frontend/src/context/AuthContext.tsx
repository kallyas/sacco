import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth.types';
import AuthService from '@/services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // If token is present but user data is unavailable, try to refresh token
            const refreshed = await AuthService.refreshToken();
            if (refreshed) {
              const refreshedUser = await AuthService.getCurrentUser();
              if (refreshedUser) {
                setUser(refreshedUser);
                setIsAuthenticated(true);
              }
            }
          }
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await AuthService.login({ email, password });
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await AuthService.register(formData);
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;