export default function TeacherTipBox({ tip, label = "O'qituvchi maslahati" }) {
  if (!tip) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-2">
        <span className="text-lg leading-none" aria-hidden="true">
          💡
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            {label}
          </p>
          <p className="mt-1 text-sm text-amber-900">{tip}</p>
        </div>
      </div>
    </div>
  );
}
