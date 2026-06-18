const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_KEY = 'user';

export const storage = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_KEY, token),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearAuth: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
