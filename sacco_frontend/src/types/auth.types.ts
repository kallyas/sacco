export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    gender?: 'M' | 'F' | 'O';
    date_of_birth?: string;
    national_id: string;
    is_verified: boolean;
    role?: {
      id: number;
      name: string;
      description?: string;
    };
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: User;
    tokens: {
      access_token: string;
      refresh_token: string;
    };
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    gender?: 'M' | 'F' | 'O';
    date_of_birth?: string;
    national_id: string;
  }
  
  export interface RefreshTokenRequest {
    refresh_token: string;
  }
  
  export interface RefreshTokenResponse {
    tokens: {
      access_token: string;
      refresh_token: string;
    };
  }