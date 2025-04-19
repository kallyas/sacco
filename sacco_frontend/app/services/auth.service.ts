import { api } from "~/lib/api";
import type { AxiosResponse } from "axios";
import type {
  LoginCredentials,
  AuthResponse,
  RegisterData,
  User,
} from "~/types/auth";

class AuthService {
  login(credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/auth/login/", {
      email: credentials.email,
      password: credentials.password,
    });
  }

  register(data: RegisterData): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>("/auth/register/", data);
  }

  logout(): Promise<AxiosResponse<void>> {
    return api.post("/auth/logout/");
  }

  refreshToken(
    token: string
  ): Promise<AxiosResponse<{ tokens: AuthResponse["tokens"] }>> {
    return api.post<{ tokens: AuthResponse["tokens"] }>(
      "/auth/refresh-token/",
      {
        refresh_token: token,
      }
    );
  }

  forgotPassword(email: {
    email: string;
  }): Promise<AxiosResponse<{ message: string }>> {
    return api.post<{ message: string }>("/auth/forgot-password/", email);
  }

  resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<AxiosResponse<{ message: string }>> {
    return api.post<{ message: string }>("/auth/reset-password/", {
      token,
      password,
      confirm_password: confirmPassword,
    });
  }

  getCurrentUser(): Promise<AxiosResponse<User>> {
    return api.get<User>("/auth/me/");
  }

  updateProfile(data: Partial<User>): Promise<AxiosResponse<User>> {
    return api.put<User>("/auth/profile/", data);
  }

  changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<AxiosResponse<{ message: string }>> {
    return api.post<{ message: string }>("/auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }
}

export const authService = new AuthService();
