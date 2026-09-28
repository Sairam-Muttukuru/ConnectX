import apiClient from './apiClient';

export const settingsService = {
  // Get all user settings & profile details
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  // Update profile info (displayName, bio, username, email, avatarUrl)
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/settings/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.put('/settings/password', passwordData);
    return response.data;
  },

  // Toggle Two-Factor Authentication
  toggle2FA: async () => {
    const response = await apiClient.post('/settings/2fa/toggle');
    return response.data;
  },

  // Update notification preferences
  updateNotifications: async (notificationData) => {
    const response = await apiClient.put('/settings/notifications', notificationData);
    return response.data;
  },

  // Update appearance preferences (theme, accentColor, compactMode, messageFontSize)
  updateAppearance: async (appearanceData) => {
    const response = await apiClient.put('/settings/appearance', appearanceData);
    return response.data;
  },

  // Update privacy preferences
  updatePrivacy: async (privacyData) => {
    const response = await apiClient.put('/settings/privacy', privacyData);
    return response.data;
  },

  // List connected devices & active sessions
  getConnectedDevices: async () => {
    const response = await apiClient.get('/settings/devices');
    return response.data;
  },

  // Revoke a specific device session
  revokeDeviceSession: async (sessionId) => {
    const response = await apiClient.delete(`/settings/devices/${sessionId}`);
    return response.data;
  },

  // Revoke all other device sessions
  revokeAllOtherSessions: async () => {
    const response = await apiClient.post('/settings/devices/revoke-others');
    return response.data;
  },
};

export default settingsService;
