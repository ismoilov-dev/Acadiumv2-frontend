import TeacherTipBox from './TeacherTipBox';

export default function LessonSectionCard({ section, index }) {
  if (!section) return null;

  const activities = Array.isArray(section.activities) ? section.activities : [];

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <h3 className="text-base font-semibold text-gray-900">
          {index != null && (
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {index + 1}
            </span>
          )}
          {section.name || `Bo'lim ${index != null ? index + 1 : ''}`}
        </h3>
        {section.duration != null && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {section.duration} daqiqa
          </span>
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">Faoliyatlar</h4>
          <ul className="space-y-2">
            {activities.map((activity, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                <span>{activity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.teacher_tip && (
        <div className="mt-4">
          <TeacherTipBox tip={section.teacher_tip} />
        </div>
      )}
    </article>
  );
}
