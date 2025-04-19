import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig as BaseInternalAxiosRequestConfig,
} from "axios";

// Extend InternalAxiosRequestConfig to include _retry property
interface InternalAxiosRequestConfig extends BaseInternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Token storage helpers
const getAccessToken = (): string | null =>
  localStorage.getItem("access_token");
const getRefreshToken = (): string | null =>
  localStorage.getItem("refresh_token");
const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
};
const clearTokens = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// Create axios instance with base configuration
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Create a separate axios instance for token refresh to avoid infinite loops
const tokenRefreshApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if token refresh is in progress
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

// Process the queue of failed requests
const processQueue = (
  error: AxiosError | null,
  token: string | null = null
): void => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      // Retry the request with the new token
      if (token) {
        request.config.headers = request.config.headers || {};
        request.config.headers.Authorization = `Bearer ${token}`;
      }
      request.resolve(api(request.config));
    }
  });

  // Reset the queue
  failedQueue = [];
};

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // If the error is not 401 or the request is already retried, reject
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Mark this request as retried to avoid infinite loops
    originalRequest._retry = true;

    // If already refreshing token, add to queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token, clear tokens and reject
        clearTokens();
        processQueue(error);
        return Promise.reject(error);
      }

      // Attempt to refresh token
      const response = await tokenRefreshApi.post("/auth/refresh-token/", {
        refresh_token: refreshToken,
      });

      if (response.data.tokens) {
        const { access_token, refresh_token } = response.data.tokens;
        setTokens(access_token, refresh_token);

        // Update authorization header for original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process queue with new token
        processQueue(null, access_token);

        // Retry the original request
        return api(originalRequest);
      } else {
        // Token refresh failed, clear tokens and reject
        clearTokens();
        processQueue(error);
        return Promise.reject(error);
      }
    } catch (refreshError) {
      // Token refresh failed, clear tokens and reject
      clearTokens();
      processQueue(refreshError as AxiosError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
