import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppRouter from './router';
import { isTelegram, telegramLogin } from './services/telegramAuth';

export default function App() {
  const [loading, setLoading] = useState(isTelegram());

  useEffect(() => {
    const init = async () => {
      if (!isTelegram()) {
        setLoading(false);
        return;
      }

      try {
        document.documentElement.classList.add('tg-app');

        await telegramLogin();

        window.location.replace('/');
      } catch (error) {
        console.error('Telegram login error:', error);

        window.location.replace('/login?tg_error=1');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <h1 className="text-xl font-bold">Acadium AI</h1>
          <p className="mt-2 text-sm text-slate-400">
            Telegram orqali avtomatik kirilmoqda...
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