import axios from 'axios';
import { authStorage } from '../utils/authStorage';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer Access Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh on 401 & retry queued requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    // If backend wrapped response with ApiResponse<T>
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Standardized error extraction
    const responseData = error.response?.data;
    const formattedError = {
      status: error.response?.status || 500,
      code: responseData?.code || 'NETWORK_ERROR',
      message:
        responseData?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      details: responseData?.details || [],
    };

    // If 401 and not already retried and not the auth endpoints themselves
    const isAuthEndpoint =
      originalRequest.url?.includes('/api/auth/login') ||
      originalRequest.url?.includes('/api/auth/register') ||
      originalRequest.url?.includes('/api/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) {
        isRefreshing = false;
        authStorage.clearAuth();
        window.dispatchEvent(new Event('connectx_auth_logout'));
        return Promise.reject(formattedError);
      }

      try {
        const refreshResponse = await axios.post(
          `${axiosClient.defaults.baseURL}/api/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newAccessToken) {
          authStorage.setAccessToken(newAccessToken);
          if (newRefreshToken) {
            authStorage.setRefreshToken(newRefreshToken);
          }

          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } else {
          throw new Error('Refresh token rotation failed to return access token');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        authStorage.clearAuth();
        window.dispatchEvent(new Event('connectx_auth_logout'));
        return Promise.reject(formattedError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(formattedError);
  }
);

export default axiosClient;
