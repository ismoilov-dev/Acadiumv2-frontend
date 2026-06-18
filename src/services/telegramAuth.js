import { storage } from '../utils/storage'

export const isTelegram = () =>
  !!(window.Telegram?.WebApp?.initData)

export const telegramLogin = async () => {
  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()

  const init_data = tg.initData
  if (!init_data) throw new Error('Telegram initData mavjud emas')

  // Get API base URL from environment or construct it
  const apiBase = import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`;

  const res = await fetch(`${apiBase}/auth/telegram/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data })
  })

  if (!res.ok) throw new Error('Telegram auth xato')

  const data = await res.json()

  // storage util ishlatiladi — to'g'ri key lar bilan
  storage.setAccessToken(data.access)
  storage.setRefreshToken(data.refresh)
  storage.setUser(data.user)

  return data
}

export const initTelegramAuth = telegramLogin;