import axios from 'axios';
import { storage } from '../utils/storage';

export const isTelegram = () => {
  return !!window.Telegram?.WebApp?.initData;
};

export const telegramLogin = async () => {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    throw new Error('Telegram WebApp topilmadi');
  }

  tg.ready();
  tg.expand();

  const init_data = tg.initData;

  if (!init_data) {
    throw new Error('Telegram initData mavjud emas');
  }

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    'https://acadium.duckdns.org';

  console.log('Telegram Auth URL:', `${API_BASE}/api/auth/telegram/`);

  const response = await axios.post(
    `${API_BASE}/api/auth/telegram/`,
    {
      init_data,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = response.data;

  storage.setAccessToken(data.access);
  storage.setRefreshToken(data.refresh);
  storage.setUser(data.user);

  return data;
};

export const initTelegramAuth = telegramLogin;
