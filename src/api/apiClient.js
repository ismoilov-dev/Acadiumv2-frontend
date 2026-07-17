import axios from 'axios';
import { storage } from '../utils/storage';

const normalizeBaseURL = (url) => url.replace(/\/+$/, '');

const getBaseURL = () => {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  if (raw) {
    const normalized = normalizeBaseURL(raw);
    return normalized.endsWith('/api') ? `${normalized}/` : `${normalized}/api/`;
  }
  return `${window.location.origin}/api/`;
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = storage.getRefreshToken();
    const tgInitData = window.Telegram?.WebApp?.initData;

    if (!refreshToken) {
      if (tgInitData) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const { data } = await axios.post(`${getBaseURL()}auth/telegram/`, { init_data: tgInitData });
          storage.setAccessToken(data.access);
          storage.setRefreshToken(data.refresh);
          storage.setUser(data.user);
          processQueue(null, data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return apiClient(originalRequest);
        } catch (tgError) {
          processQueue(tgError, null);
          storage.clearAuth();
          return Promise.reject(tgError);
        } finally {
          isRefreshing = false;
        }
      } else {
        storage.clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${getBaseURL()}auth/token/refresh/`, {
        refresh: refreshToken,
      });
      storage.setAccessToken(data.access);
      processQueue(null, data.access);
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (tgInitData) {
        try {
          const { data } = await axios.post(`${getBaseURL()}auth/telegram/`, { init_data: tgInitData });
          storage.setAccessToken(data.access);
          storage.setRefreshToken(data.refresh);
          storage.setUser(data.user);
          processQueue(null, data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return apiClient(originalRequest);
        } catch (tgError) {
          processQueue(tgError, null);
          storage.clearAuth();
          return Promise.reject(tgError);
        }
      } else {
        processQueue(refreshError, null);
        storage.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;