const ACCESS_TOKEN_KEY = 'connectx_access_token';
const REFRESH_TOKEN_KEY = 'connectx_refresh_token';
const USER_KEY = 'connectx_user';

export const authStorage = {
  getAccessToken: () => {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setAccessToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    } catch (e) {
      console.error('Failed to set access token', e);
    }
  },

  getRefreshToken: () => {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setRefreshToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (e) {
      console.error('Failed to set refresh token', e);
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {
      console.error('Failed to set user', e);
    }
  },

  setAuthSession: ({ accessToken, refreshToken, user }) => {
    if (accessToken) authStorage.setAccessToken(accessToken);
    if (refreshToken) authStorage.setRefreshToken(refreshToken);
    if (user) authStorage.setUser(user);
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear auth storage', e);
    }
  },
};

export default authStorage;
