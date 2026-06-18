export default function HomeworkSection({ homework }) {
  if (!homework) return null;

  return (
    <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xl">
          📚
        </span>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-800">
            Uyga vazifa
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-indigo-900">{homework}</p>
        </div>
      </div>
    </section>
  );
}
