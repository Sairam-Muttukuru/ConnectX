import axios from 'axios';
import { authStorage } from '../utils/authStorage';

/**
 * Real-time WebSocket Client for ConnectX Messaging
 * Connects directly to Spring Boot WebSocket endpoint /ws/chat
 */

class ChatSocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map(); // event -> Set of callbacks
    this.reconnectTimer = null;
    this.pingInterval = null;
    this.isConnected = false;
    this.intentionalClose = false;
    this.reconnectAttempts = 0;
  }

  async ensureValidToken() {
    let token = authStorage.getAccessToken() || localStorage.getItem('connectx_access_token');
    if (!token) return null;

    let isExpired = false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000 - 15000) {
        isExpired = true;
      }
    } catch {
      isExpired = false;
    }

    if (isExpired) {
      const refreshToken = authStorage.getRefreshToken() || localStorage.getItem('connectx_refresh_token');
      if (refreshToken) {
        try {
          const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
          const baseUrl = apiBase.replace(/\/api\/?$/, '');
          const res = await axios.post(`${baseUrl}/api/auth/refresh`, { refreshToken });
          const newAccess = res.data?.data?.accessToken;
          const newRefresh = res.data?.data?.refreshToken;
          if (newAccess) {
            authStorage.setAccessToken(newAccess);
            if (newRefresh) authStorage.setRefreshToken(newRefresh);
            token = newAccess;
            console.log('[ChatSocket] Access token refreshed successfully for WebSocket');
          }
        } catch (err) {
          console.warn('[ChatSocket] Token refresh error:', err.message);
        }
      }
    }

    return token;
  }

  async getWsUrl() {
    const token = await this.ensureValidToken();
    if (!token) return null;

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const baseUrl = apiBase.replace(/\/api\/?$/, '');
    const wsProtocol = baseUrl.startsWith('https') ? 'wss:' : 'ws:';
    const host = baseUrl.replace(/^https?:\/\//, '');

    return `${wsProtocol}//${host}/ws/chat?token=${encodeURIComponent(token)}`;
  }

  async connect(force = false) {
    const token = await this.ensureValidToken();
    if (!token) {
      console.warn('[ChatSocket] No valid auth token; skipping WebSocket connect');
      return;
    }

    if (force || (this.currentToken && this.currentToken !== token)) {
      this.disconnect();
    } else if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return; // Already connecting or connected with valid token
    }

    this.currentToken = token;
    this.intentionalClose = false;

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const baseUrl = apiBase.replace(/\/api\/?$/, '');
    const wsProtocol = baseUrl.startsWith('https') ? 'wss:' : 'ws:';
    const host = baseUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}//${host}/ws/chat?token=${encodeURIComponent(token)}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log('[ChatSocket] Connected to ConnectX WebSocket server');
        this.emit('connection', { status: 'connected' });

        // Request list of online users immediately on connection
        this.requestOnlineUsers();

        // Keep connection warm with periodic ping
        clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'PING' }));
          }
        }, 25000);
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.handleIncomingMessage(payload);
        } catch (e) {
          console.error('[ChatSocket] Failed to parse message JSON:', e);
        }
      };

      this.socket.onerror = (err) => {
        console.warn('[ChatSocket] Error occurred:', err);
      };

      this.socket.onclose = async (event) => {
        this.isConnected = false;
        clearInterval(this.pingInterval);
        this.emit('connection', { status: 'disconnected', code: event.code });

        if (!this.intentionalClose) {
          const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 12000);
          this.reconnectAttempts++;
          console.log(`[ChatSocket] Disconnected. Reconnecting in ${Math.round(delay / 1000)}s...`);
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = setTimeout(() => this.connect(), delay);
        }
      };
    } catch (err) {
      console.error('[ChatSocket] Connection creation error:', err);
    }
  }

  handleIncomingMessage(payload) {
    if (!payload || !payload.type) return;

    const type = payload.type.toUpperCase();

    if (type === 'PONG') {
      return;
    }

    if (type === 'NEW_MESSAGE' || type === 'MESSAGE_SENT') {
      this.emit('message', payload.message);
    } else if (type === 'USER_TYPING') {
      this.emit('typing', { senderId: payload.senderId, isTyping: payload.isTyping });
    } else if (type === 'MESSAGES_READ') {
      this.emit('read', { senderId: payload.senderId });
    } else if (type === 'USER_STATUS') {
      this.emit('status', {
        userId: payload.senderId,
        status: payload.status,
        timestamp: payload.timestamp || new Date().toISOString(),
      });
    } else if (type === 'ONLINE_USERS_LIST') {
      this.emit('online_users', payload.onlineUserIds || []);
    } else if (type === 'CONNECTED') {
      this.emit('ready', payload);
    } else {
      this.emit(type.toLowerCase(), payload);
    }
  }

  /**
   * Request full online users list from server
   */
  requestOnlineUsers() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify({ type: 'GET_ONLINE_USERS' }));
      } catch (e) {
        // Ignored
      }
    }
  }

  /**
   * Send a chat message over WebSocket
   */
  sendChatMessage({ recipientId, content, messageType = 'TEXT', mediaUrl = null, mediaName = null }) {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    const payload = {
      type: 'SEND_MESSAGE',
      recipientId,
      content,
      messageType,
      mediaUrl,
      mediaName,
    };

    try {
      this.socket.send(JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error('[ChatSocket] Failed to send message:', err);
      return false;
    }
  }

  /**
   * Send typing indicator
   */
  sendTyping({ recipientId, isTyping }) {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      this.socket.send(
        JSON.stringify({
          type: 'TYPING',
          recipientId,
          isTyping,
        })
      );
    } catch (e) {
      // Ignored
    }
  }

  /**
   * Notify server that messages from partner were read
   */
  markAsRead(partnerId) {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      this.socket.send(
        JSON.stringify({
          type: 'MARK_READ',
          senderId: partnerId,
        })
      );
    } catch (e) {
      // Ignored
    }
  }

  /**
   * Event registration
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        try {
          callback(data);
        } catch (err) {
          console.error(`[ChatSocket] Error in listener for ${event}:`, err);
        }
      }
    }
  }

  disconnect() {
    this.intentionalClose = true;
    this.currentToken = null;
    clearTimeout(this.reconnectTimer);
    clearInterval(this.pingInterval);
    if (this.socket) {
      try {
        this.socket.close();
      } catch (ignored) {}
      this.socket = null;
    }
    this.isConnected = false;
  }
}

export const chatSocket = new ChatSocketManager();
export default chatSocket;
