import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppRouter from './router';
import { authService } from './services/authService';
import { storage } from './utils/storage';

import { isTelegram } from './services/telegramAuth';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const hasToken = !!storage.getAccessToken();

        if (isTelegram() && !hasToken) {
          try {
            const initData = window.Telegram.WebApp.initData;
            await authService.telegramLogin(initData);
          } catch (err) {
            console.error('Telegram auth failed:', err);
            const errorMsg = err.response?.data?.detail || err.message || 'Telegram authentication failed';
            setError(`Authentication failed: ${errorMsg}`);
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setReady(true);
      }
    };

    initAuth();
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <h1 className="text-xl font-bold">Acadium AI</h1>
          <p className="mt-2 text-sm text-slate-400">
            {error ? 'Initializing...' : 'Initializing authentication...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white p-4">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-sm max-w-md w-full">
          <h1 className="mb-4 text-2xl font-bold text-red-400">Tizimga kirishda xatolik</h1>
          <p className="mb-6 text-slate-300">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 transition-colors"
            >
              Qayta urinish
            </button>
            <button 
              onClick={() => { setError(null); window.location.href = '/login'; }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              Boshqa usulda kirish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
