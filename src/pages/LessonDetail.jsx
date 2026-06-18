import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import LessonContent from '../components/lesson/LessonContent';
import { lessonService } from '../services/lessonService';
import { SUBJECTS, LANGUAGES } from '../utils/constants';
import { formatError } from '../utils/formatError';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await lessonService.get(id);
        setLesson(data);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bu darsni o'chirmoqchimisiz?")) return;
    setActionLoading('delete');
    try {
      await lessonService.delete(id);
      navigate('/lessons');
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoading('');
    }
  };

  const handleShare = async () => {
    setActionLoading('share');
    try {
      const data = await lessonService.share(id);
      setShareLink(data.share_link);
      setLesson((prev) => ({ ...prev, is_shared: true }));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoading('');
    }
  };

  const handleDownload = async () => {
    setActionLoading('download');
    try {
      // Request backend to send PPTX via Telegram — no browser download
      await lessonService.sendToTelegram(id);
      // Show success message
      setSuccess('✅ PPTX fayl Telegram chatga yuborildi.');
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoading('');
    }
  };

  const copyShareLink = () => {
    const link = shareLink || `${window.location.origin}/public/${lesson.share_token}`;
    navigator.clipboard.writeText(link);
  };

  if (loading) return <MainLayout><LoadingSpinner message="Dars yuklanmoqda..." /></MainLayout>;
  if (error && !lesson) return <MainLayout><ErrorMessage message={error} /></MainLayout>;
  if (!lesson) return null;

  const subjectLabel = SUBJECTS.find((s) => s.value === lesson.subject)?.label;
  const languageLabel = LANGUAGES.find((l) => l.value === lesson.language)?.label;

  return (
    <MainLayout>
      <div className="mb-4">
        <Link to="/lessons" className="text-sm text-primary-600 hover:underline">
          ← Darslar ro'yxati
        </Link>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      {success && <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">{success}</div>}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{lesson.title}</h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 font-medium">
              {subjectLabel} · {lesson.grade}-sinf · {lesson.duration} daqiqa · {languageLabel}
            </p>
            <p className="mt-1 text-2xs sm:text-xs text-gray-400">
              {new Date(lesson.created_at).toLocaleString('uz-UZ')}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={lesson.status} />
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-700">So'rov:</p>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">{lesson.prompt}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {lesson.status === 'completed' && (
            <>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!!actionLoading}
                className="rounded-lg bg-primary-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 tap-target flex items-center justify-center"
              >
                {actionLoading === 'download' ? 'Yuklanmoqda...' : 'PPTX yuklab olish'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={!!actionLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 tap-target flex items-center justify-center"
              >
                {actionLoading === 'share' ? 'Ulashilmoqda...' : 'Ulashish'}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={!!actionLoading}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 tap-target flex items-center justify-center"
          >
            {actionLoading === 'delete' ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>


        {(shareLink || lesson.is_shared) && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
            <input
              readOnly
              value={shareLink || `${window.location.origin}/public/${lesson.share_token}`}
              className="flex-1 bg-transparent text-sm text-green-800 outline-none"
            />
            <button
              type="button"
              onClick={copyShareLink}
              className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              Nusxalash
            </button>
          </div>
        )}
      </div>

      <LessonContent
        lessonPlan={lesson.lesson_plan}
        slides={lesson.slides}
        assessment={lesson.assessment}
      />
    </MainLayout>
  );
}
