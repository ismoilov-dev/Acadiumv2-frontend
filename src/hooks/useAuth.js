import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!storage.getAccessToken();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!storage.getAccessToken()) {
          setUser(null);
          setLoading(false);
          return;
        }

        const profile = await authService.getProfile();
        setUser(profile);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        storage.clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      if (!storage.getAccessToken()) {
        setUser(null);
        return;
      }
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      storage.clearAuth();
      setUser(null);
      throw err;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };
}
