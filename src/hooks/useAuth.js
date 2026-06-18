import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!storage.getAccessToken();

  const refreshUser = useCallback(async () => {
    if (!storage.getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch {
      storage.clearAuth();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, isAuthenticated, login, logout, refreshUser };
}
