import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppRouter from './router';
import { isTelegram, telegramLogin } from './services/telegramAuth';
import { storage } from './utils/storage';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const hasToken = !!storage.getAccessToken();

        if (isTelegram() && !hasToken) {
          try {
            await telegramLogin();
          } catch (err) {
            console.error('Telegram auth failed:', err);
            setError('Telegram authentication failed');
          }
        }

        setReady(true);
      } catch (err) {
        console.error('Auth init error:', err);
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

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
