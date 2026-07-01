import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { lessonService } from '../services/lessonService';
import { formatError } from '../utils/formatError';

export default function Dashboard() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await lessonService.list();
        setLessons(data);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const stats = {
    total: lessons.length,
    completed: lessons.filter((l) => l.status === 'completed').length,
    processing: lessons.filter((l) => l.status === 'processing').length,
    failed: lessons.filter((l) => l.status === 'failed').length,
  };

  const recentLessons = lessons.slice(0, 5);

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
          Xush kelibsiz, {user?.full_name || user?.email}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">AI yordamida dars rejalarini yarating va boshqaring</p>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Jami darslar', value: stats.total, color: 'text-gray-900', border: 'border-l-4 border-l-indigo-500' },
              { label: 'Tayyor', value: stats.completed, color: 'text-green-600', border: 'border-l-4 border-l-green-500' },
              { label: 'Jarayonda', value: stats.processing, color: 'text-blue-600', border: 'border-l-4 border-l-blue-500' },
              { label: 'Xatolik', value: stats.failed, color: 'text-red-600', border: 'border-l-4 border-l-red-500' },
            ].map(({ label, value, color, border }) => (
              <div key={label} className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all ${border}`}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
                <p className={`mt-1.5 text-2xl md:text-3xl font-extrabold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Section Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">So'nggi darslar</h2>
            <Link
              to="/lessons/generate"
              className="hidden md:inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm tap-target"
            >
              + Yangi dars
            </Link>
          </div>

          {/* Floating Action Button for Mobile */}
          <Link
            to="/lessons/generate"
            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all md:hidden tap-target"
            aria-label="Yangi dars yaratish"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          {/* Recent Lessons List / Table */}
          {recentLessons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 md:p-12 text-center shadow-sm">
              <p className="text-gray-500 text-sm">Hali darslar yo'q</p>
              <Link
                to="/lessons/generate"
                className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
              >
                Birinchi darsni yarating
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Sarlavha</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Holat</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Sana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentLessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link to={`/lessons/${lesson.id}`} className="font-semibold text-primary-600 hover:text-primary-700 hover:underline text-sm sm:text-base">
                            {lesson.title}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={lesson.status} />
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500">
                          {new Date(lesson.created_at).toLocaleDateString('uz-UZ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden space-y-3">
                {recentLessons.map((lesson) => (
                  <div key={lesson.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/lessons/${lesson.id}`}
                          className="block text-base font-semibold text-gray-900 hover:text-primary-600 leading-snug truncate"
                        >
                          {lesson.title}
                        </Link>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-gray-500 font-medium">
                          <span>{new Date(lesson.created_at).toLocaleDateString('uz-UZ')}</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={lesson.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </MainLayout>
  );
}
