import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:8000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config;

    // If error is 401 Unauthorized and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = Cookies.get("refresh_token");

        if (!refreshToken) {
          // If no refresh token, force logout
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh_token/`, {
          refresh_token: refreshToken,
        });

        if (response.data.tokens) {
          const { access_token, refresh_token } = response.data.tokens;

          // Update cookies
          Cookies.set("access_token", access_token, {
            expires: 1, // 1 day
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          Cookies.set("refresh_token", refresh_token, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, log the user out
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
