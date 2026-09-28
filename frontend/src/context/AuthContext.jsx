import React, { createContext, useState, useEffect, useCallback } from 'react';
import authStorage from '../utils/authStorage';
import authApi from '../api/authApi';
import chatSocket from '../services/chatSocket';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [accessToken, setAccessToken] = useState(() => authStorage.getAccessToken());
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authStorage.getAccessToken()));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {});
      }
    } finally {
      chatSocket.disconnect();
      authStorage.clearAuth();
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Listen for forced logout event from axiosClient (expired refresh session)
  useEffect(() => {
    const handleForcedLogout = () => {
      logout();
    };
    window.addEventListener('connectx_auth_logout', handleForcedLogout);
    return () => window.removeEventListener('connectx_auth_logout', handleForcedLogout);
  }, [logout]);

  // Listen for profile updates across views to update global user state
  useEffect(() => {
    const handleProfileUpdated = (e) => {
      if (e?.detail) {
        setUser((prev) => ({ ...prev, ...e.detail }));
        const current = authStorage.getUser() || {};
        authStorage.setUser({ ...current, ...e.detail });
      }
    };
    window.addEventListener('connectx_profile_updated', handleProfileUpdated);
    return () => window.removeEventListener('connectx_profile_updated', handleProfileUpdated);
  }, []);

  // Initial verification on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getAccessToken();
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.data) {
            setUser(res.data);
            authStorage.setUser(res.data);
            setIsAuthenticated(true);
          }
        } catch {
          // Token might be invalid or refresh failed
          authStorage.clearAuth();
          setUser(null);
          setAccessToken(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    const res = await authApi.login({ identifier, password });
    const { accessToken, refreshToken, user: authUser } = res.data;

    authStorage.setAuthSession({ accessToken, refreshToken, user: authUser });
    setAccessToken(accessToken);
    setUser(authUser);
    setIsAuthenticated(true);
    chatSocket.connect(true);
    return authUser;
  };

  const register = async (registerData) => {
    const res = await authApi.register(registerData);
    return res;
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getCurrentUser();
      if (res.data) {
        setUser(res.data);
        authStorage.setUser(res.data);
      }
      return res.data;
    } catch (e) {
      console.warn('Failed to refresh current user', e);
      return null;
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
