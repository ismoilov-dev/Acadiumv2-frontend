import apiClient from '../api/apiClient';
import { storage } from '../utils/storage';

const AUTH_BASE = '/api/auth';

export const authService = {
  register: async (data) => {
    const response = await apiClient.post(`${AUTH_BASE}/register/`, data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post(`${AUTH_BASE}/login/`, { email, password });
    const { access, refresh, user } = response.data;
    storage.setAccessToken(access);
    storage.setRefreshToken(refresh);
    storage.setUser(user);
    return response.data;
  },

  refreshToken: async () => {
    const refresh = storage.getRefreshToken();
    const response = await apiClient.post(`${AUTH_BASE}/token/refresh/`, { refresh });
    storage.setAccessToken(response.data.access);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get(`${AUTH_BASE}/profile/`);
    storage.setUser(response.data);
    return response.data;
  },

  updateProfile: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.patch(`${AUTH_BASE}/profile/`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    });
    storage.setUser(response.data);
    return response.data;
  },

  logout: () => {
    storage.clearAuth();
  },
};
