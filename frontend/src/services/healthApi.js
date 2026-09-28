import apiClient from './apiClient';

export const healthApi = {
  checkHealth: async () => {
    return await apiClient.get('/health');
  },

  ping: async () => {
    return await apiClient.get('/health/ping');
  },
};
