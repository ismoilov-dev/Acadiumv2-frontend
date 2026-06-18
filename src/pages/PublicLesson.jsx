import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import LessonContent from '../components/lesson/LessonContent';
import { lessonService } from '../services/lessonService';
import { SUBJECTS, LANGUAGES } from '../utils/constants';
import { formatError } from '../utils/formatError';

export default function PublicLesson() {
  const { token } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await lessonService.getPublic(token);
        setLesson(data);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Dars yuklanmoqda..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md">
          <ErrorMessage message={error} />
          <Link to="/login" className="mt-4 block text-center text-sm text-primary-600 hover:underline">
            Acadium ga kirish
          </Link>
        </div>
      </div>
    );
  }

  const subjectLabel = SUBJECTS.find((s) => s.value === lesson.subject)?.label;
  const languageLabel = LANGUAGES.find((l) => l.value === lesson.language)?.label;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-4xl px-4">
          <Link to="/" className="text-xl font-bold text-primary-600">
            Acadium
          </Link>
          <p className="mt-1 text-sm text-gray-500">Ulashilgan dars</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="mt-2 text-sm text-gray-600">
                {subjectLabel} · {lesson.grade}-sinf · {lesson.duration} daqiqa · {languageLabel}
              </p>
            </div>
            <StatusBadge status={lesson.status} />
          </div>
        </div>

        <LessonContent
          lessonPlan={lesson.lesson_plan}
          slides={lesson.slides}
          assessment={lesson.assessment}
        />
      </main>
    </div>
  );
}
