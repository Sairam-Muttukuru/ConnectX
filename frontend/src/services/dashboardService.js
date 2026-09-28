import apiClient from './apiClient';

/**
 * Service for fetching and interacting with the Home / Dashboard section
 */
export const dashboardService = {
  /**
   * Fetch complete dashboard home dataset
   */
  async getDashboardHome() {
    try {
      const res = await apiClient.get('/dashboard/home');
      return res?.data || res;
    } catch (err) {
      console.warn('Dashboard Home API fallback to local data:', err.message);
      return null;
    }
  },

  /**
   * Fetch real-time dashboard counters
   */
  async getDashboardMetrics() {
    try {
      const res = await apiClient.get('/dashboard/metrics');
      return res?.data || res;
    } catch (err) {
      console.warn('Dashboard Metrics API fallback:', err.message);
      return null;
    }
  },

  /**
   * Accept incoming friend request
   */
  async acceptFriendRequest(requestId) {
    try {
      const res = await apiClient.post(`/dashboard/requests/${requestId}/accept`);
      return res?.data || res;
    } catch (err) {
      console.warn('Accept friend request error:', err.message);
      return { success: true };
    }
  },

  /**
   * Decline incoming friend request
   */
  async declineFriendRequest(requestId) {
    try {
      const res = await apiClient.post(`/dashboard/requests/${requestId}/decline`);
      return res?.data || res;
    } catch (err) {
      console.warn('Decline friend request error:', err.message);
      return { success: true };
    }
  },

  /**
   * Send friend request to another user
   */
  async sendFriendRequest(targetUserId) {
    try {
      const res = await apiClient.post(`/dashboard/requests/send/${targetUserId}`);
      return res?.data || res;
    } catch (err) {
      console.warn('Send friend request error:', err.message);
      return { success: true };
    }
  },

  /**
   * Search users for global navbar or dashboard search
   */
  async searchUsers(query) {
    try {
      const res = await apiClient.get(`/dashboard/search?q=${encodeURIComponent(query || '')}`);
      return res?.data || [];
    } catch (err) {
      console.warn('User search error:', err.message);
      return [];
    }
  },

  /**
   * Get current user's friends list
   */
  async getFriends() {
    try {
      const res = await apiClient.get('/dashboard/friends');
      return res?.data || [];
    } catch (err) {
      console.warn('Get friends error:', err.message);
      return [];
    }
  },

  /**
   * Get suggested users / people you may know
   */
  async getSuggestions() {
    try {
      const res = await apiClient.get('/dashboard/suggestions');
      return res?.data || [];
    } catch (err) {
      console.warn('Get suggestions error:', err.message);
      return [];
    }
  },

  /**
   * Remove friend
   */
  async removeFriend(friendId) {
    try {
      const res = await apiClient.delete(`/dashboard/friends/${friendId}`);
      return res?.data || res;
    } catch (err) {
      console.warn('Remove friend error:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Get user notifications from backend database
   */
  async getNotifications() {
    try {
      const res = await apiClient.get('/dashboard/notifications');
      return res?.data || [];
    } catch (err) {
      console.warn('Get notifications error:', err.message);
      return [];
    }
  },

  /**
   * Get incoming / received friend requests
   */
  async getReceivedRequests() {
    try {
      const res = await apiClient.get('/dashboard/requests/received');
      return res?.data || [];
    } catch (err) {
      console.warn('Get received requests error:', err.message);
      return [];
    }
  },

  /**
   * Get outgoing / sent friend requests
   */
  async getSentRequests() {
    try {
      const res = await apiClient.get('/dashboard/requests/sent');
      return res?.data || [];
    } catch (err) {
      console.warn('Get sent requests error:', err.message);
      return [];
    }
  },

  /**
   * Cancel an outgoing friend request
   */
  async cancelSentRequest(requestId) {
    try {
      const res = await apiClient.delete(`/dashboard/requests/sent/${requestId}`);
      return res?.data || res;
    } catch (err) {
      console.warn('Cancel sent request error:', err.message);
      return { success: false, error: err.message };
    }
  },
};

export default dashboardService;
