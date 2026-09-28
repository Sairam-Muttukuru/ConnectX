import axios from 'axios';

// Base API Client configured for ConnectX Spring Boot backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor for attaching Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('connectx_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for standardized error extraction
apiClient.interceptors.response.use(
  (response) => {
    // If Spring Boot backend returns ApiResponse<T>
    return response.data;
  },
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      code: error.response?.data?.code || 'SERVER_ERROR',
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      details: error.response?.data?.details || [],
    };

    // If 401 Unauthorized, notify or clear session if needed
    if (customError.status === 401) {
      // Handled in auth context or token refresher
    }

    return Promise.reject(customError);
  }
);

export default apiClient;
