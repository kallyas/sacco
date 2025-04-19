export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender?: string;
  date_of_birth?: string;
  national_id: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender?: string;
  date_of_birth?: string;
  national_id: string;
  is_verified: boolean;
  role?: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}