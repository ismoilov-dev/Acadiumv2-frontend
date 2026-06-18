import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppRouter from './router'
import { isTelegram, telegramLogin } from './services/telegramAuth'

export default function App() {
  const [ready, setReady] = useState(!isTelegram())
  // Telegram ichida ochilmagan bo'lsa — ready=true, to'g'ridan router chiqadi
  // Telegram ichida bo'lsa — ready=false, avval auto-login qiladi

  useEffect(() => {
    if (!isTelegram()) return

    document.documentElement.classList.add('tg-app');

    telegramLogin()
      .then(() => setReady(true))
      .catch((err) => {
        console.error('Telegram login xato:', err)
        setReady(true) // xato bo'lsa ham router chiqsin
      })
  }, [])

  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white px-4">
        <div className="flex flex-col items-center justify-center space-y-6 max-w-sm w-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
            <div className="absolute w-8 h-8 bg-indigo-500/10 rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Acadium AI
            </h1>
            <p className="mt-2 text-xs text-indigo-200/60 font-medium tracking-wider uppercase animate-pulse">
              Telegram orqali kirilmoqda...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}