import axiosClient from './axiosClient';

export const authApi = {
  register: (payload) => {
    return axiosClient.post('/api/auth/register', payload);
  },

  login: (payload) => {
    return axiosClient.post('/api/auth/login', payload);
  },

  verifyEmail: (payload) => {
    const data = typeof payload === 'string' ? { otp: payload, token: payload } : payload;
    return axiosClient.post('/api/auth/verify-email', data);
  },

  resendVerification: (email) => {
    return axiosClient.post('/api/auth/resend-verification', { email });
  },

  refreshToken: (refreshToken) => {
    return axiosClient.post('/api/auth/refresh', { refreshToken });
  },

  logout: (refreshToken) => {
    return axiosClient.post('/api/auth/logout', { refreshToken });
  },

  forgotPassword: (email) => {
    return axiosClient.post('/api/auth/forgot-password', { email });
  },

  resetPassword: (payload) => {
    return axiosClient.post('/api/auth/reset-password', payload);
  },

  getCurrentUser: () => {
    return axiosClient.get('/api/auth/me');
  },

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/api/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default authApi;
