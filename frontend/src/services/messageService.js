import apiClient from './apiClient';

/**
 * Service for fetching and interacting with real-world ConnectX Messages
 */
export const messageService = {
  /**
   * Fetch all real conversations for the authenticated user
   */
  async getConversations() {
    try {
      const res = await apiClient.get('/messages/conversations');
      return res?.data || [];
    } catch (err) {
      console.warn('Error fetching conversations:', err.message);
      return [];
    }
  },

  /**
   * Fetch real chat history between current user and partner
   */
  async getMessageHistory(partnerId) {
    if (!partnerId) return [];
    try {
      const res = await apiClient.get(`/messages/history/${partnerId}`);
      return res?.data || [];
    } catch (err) {
      console.warn(`Error fetching message history with ${partnerId}:`, err.message);
      return [];
    }
  },

  /**
   * Send a real message via REST (used directly or as WebSocket fallback)
   */
  async sendMessage(recipientId, content, messageType = 'TEXT', mediaUrl = null, mediaName = null) {
    try {
      const res = await apiClient.post('/messages/send', {
        recipientId,
        content,
        messageType,
        mediaUrl,
        mediaName,
      });
      return res?.data || null;
    } catch (err) {
      console.error('Error sending message via REST:', err.message);
      throw err;
    }
  },

  /**
   * Mark all unread messages from a partner as read
   */
  async markAsRead(partnerId) {
    if (!partnerId) return;
    try {
      await apiClient.post(`/messages/read/${partnerId}`);
    } catch (err) {
      console.warn(`Error marking conversation ${partnerId} as read:`, err.message);
    }
  },

  /**
   * Get total real unread messages count
   */
  async getUnreadCount() {
    try {
      const res = await apiClient.get('/messages/unread-count');
      return typeof res?.data === 'number' ? res.data : 0;
    } catch (err) {
      console.warn('Error getting unread count:', err.message);
      return 0;
    }
  },

  /**
   * Get friends available to start a new chat with
   */
  async getFriendsToChat() {
    try {
      const res = await apiClient.get('/messages/friends');
      return res?.data || [];
    } catch (err) {
      console.warn('Error fetching friends to chat:', err.message);
      return [];
    }
  },
};

export default messageService;
