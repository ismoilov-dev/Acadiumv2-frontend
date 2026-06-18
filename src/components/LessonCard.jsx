import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { SUBJECTS } from '../utils/constants';

export default function LessonCard({ lesson, onDelete }) {
  const subjectLabel = SUBJECTS.find((s) => s.value === lesson.subject)?.label || lesson.subject;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            to={`/lessons/${lesson.id}`}
            className="text-base sm:text-lg font-bold text-gray-900 hover:text-primary-600 leading-snug block truncate"
          >
            {lesson.title}
          </Link>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
            {subjectLabel} · {lesson.grade}-sinf · {lesson.duration} daqiqa
          </p>
          <p className="mt-1 text-2xs sm:text-xs text-gray-400">
            {new Date(lesson.created_at).toLocaleDateString('uz-UZ')}
          </p>
        </div>
        <StatusBadge status={lesson.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/lessons/${lesson.id}`}
          className="rounded-lg bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-700 hover:shadow-sm transition-all tap-target flex items-center justify-center"
        >
          Ko'rish
        </Link>
        {lesson.status === 'completed' && (
          <Link
            to={`/lessons/${lesson.id}`}
            className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all tap-target flex items-center justify-center"
          >
            Yuklab olish
          </Link>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(lesson.id)}
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-all tap-target flex items-center justify-center"
          >
            O'chirish
          </button>
        )}
      </div>
    </div>

  );
}
