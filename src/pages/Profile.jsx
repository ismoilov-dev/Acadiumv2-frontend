import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { formatError } from '../utils/formatError';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ full_name: user.full_name || '', email: user.email || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('full_name', form.full_name);
      data.append('email', form.email);
      if (avatar) data.append('avatar', avatar);

      await authService.updateProfile(data);
      await refreshUser();
      setSuccess('Profil muvaffaqiyatli yangilandi');
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <MainLayout>
      <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900">Profil</h1>

      <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mb-6 flex items-center gap-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
              {(user.full_name || user.email)?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{user.full_name}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              To'liq ism
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Avatar
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
