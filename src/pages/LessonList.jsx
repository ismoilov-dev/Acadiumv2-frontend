import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LessonCard from '../components/LessonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { lessonService } from '../services/lessonService';
import { formatError } from '../utils/formatError';

export default function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLessons = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await lessonService.list();
      setLessons(data);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu darsni o'chirmoqchimisiz?")) return;
    try {
      await lessonService.delete(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(formatError(err));
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Darslar</h1>
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


      {error && <div className="mb-4"><ErrorMessage message={error} onRetry={fetchLessons} /></div>}

      {loading ? (
        <LoadingSpinner message="Darslar yuklanmoqda..." />
      ) : lessons.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-gray-500">Hali darslar yo'q</p>
          <Link
            to="/lessons/generate"
            className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline"
          >
            Birinchi darsni yarating
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </MainLayout>
  );
}
