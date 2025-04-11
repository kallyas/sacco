import { api } from "~/lib/api";


export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>("/auth/login/", credentials);
    return response;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>("/auth/register/", data);
    return response;
  },

  logout: async () => {
    localStorage.removeItem("token");
    return api.post("/auth/logout");
  },

  forgotPassword: async (email: string) => {
    return api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, password: string, confirmPassword: string) => {
    return api.post("/auth/reset-password", { token, password, confirmPassword });
  },

  getCurrentUser: async () => {
    const response = await api.get<Pick<AuthResponse, "user">>("/auth/me");
    return response.data;
  },

  updateProfile: async (data: Partial<RegisterData>) => {
    const response = await api.put<AuthResponse>("/auth/profile", data);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return api.post("/auth/change-password", { oldPassword, newPassword });
  },

  refreshToken: async () => {
    return await api.post<Pick<AuthResponse, "tokens">>("/auth/refresh-token");
  },
};
