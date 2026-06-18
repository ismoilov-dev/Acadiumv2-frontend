import apiClient from '../api/apiClient';
import { storage } from '../utils/storage';

export const isTelegram = () => {
  return !!window.Telegram?.WebApp?.initData;
};

export const telegramLogin = async () => {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    throw new Error('Telegram WebApp not available');
  }

  tg.ready();
  tg.expand();

  const init_data = tg.initData;

  if (!init_data) {
    throw new Error('Telegram initData not found');
  }

  const response = await apiClient.post('auth/telegram/', { init_data });

  const data = response.data;

  storage.setAccessToken(data.access);
  storage.setRefreshToken(data.refresh);
  storage.setUser(data.user);

  return data;
};

export const initTelegramAuth = telegramLogin;
