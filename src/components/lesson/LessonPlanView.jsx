import LessonSectionCard from './LessonSectionCard';
import HomeworkSection from './HomeworkSection';

export default function LessonPlanView({ plan }) {
  if (!plan) return null;

  const objectives = Array.isArray(plan.objectives) ? plan.objectives : [];
  const sections = Array.isArray(plan.sections) ? plan.sections : [];
  const materials = Array.isArray(plan.materials) ? plan.materials : [];
  const totalDuration = sections.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Dars rejasi</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {plan.title && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Sarlavha</p>
              <p className="mt-1 font-semibold text-gray-900">{plan.title}</p>
            </div>
          )}
          {totalDuration > 0 && (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Davomiylik</p>
              <p className="mt-1 font-semibold text-gray-900">{totalDuration} daqiqa</p>
            </div>
          )}
        </div>

        {objectives.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Dars maqsadlari</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {objectives.map((objective, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-900"
                >
                  <span className="font-bold text-green-600">✓</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {materials.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Materiallar</h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((material, i) => (
                <span
                  key={i}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {sections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Bo'limlar</h3>
          {sections.map((section, i) => (
            <LessonSectionCard key={i} section={section} index={i} />
          ))}
        </div>
      )}

      <HomeworkSection homework={plan.homework} />
    </section>
  );
}
