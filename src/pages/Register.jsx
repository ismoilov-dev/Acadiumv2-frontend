import { useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import ErrorMessage from '../components/ErrorMessage';
import { authService } from '../services/authService';
import { formatError } from '../utils/formatError';
import { storage } from '../utils/storage';

import { isTelegram } from '../services/telegramAuth';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    password1: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const tgError = new URLSearchParams(location.search).get('tg_error');

  if (isTelegram()) {
    if (storage.getAccessToken()) {
      return <Navigate to="/" replace />;
    }
    if (!tgError) {
      return (
        <AuthLayout title="Acadium" subtitle="Telegram orqali avtomatik kirilmoqda...">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 animate-pulse">Hisobga kirilmoqda...</p>
          </div>
        </AuthLayout>
      );
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(form);
      navigate('/login');
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Ro'yxatdan o'tish" subtitle="Yangi hisob yarating">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}

        {[
          { name: 'full_name', label: "To'liq ism", type: 'text' },
          { name: 'username', label: 'Username', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password1', label: 'Parol (min 8 belgi)', type: 'password' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              required
              value={form[name]}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:underline">
            Kirish
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
