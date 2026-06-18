import { useState } from 'react';

function QuestionCard({ question, index }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const options = Array.isArray(question.options) ? question.options : [];
  const correctKey = question.correct?.trim()?.charAt(0)?.toUpperCase();

  const getOptionKey = (option) => option.trim().charAt(0).toUpperCase();

  const handleSelect = (option) => {
    if (revealed) return;
    setSelected(getOptionKey(option));
    setRevealed(true);
  };

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
          {question.number ?? index + 1}
        </span>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{question.question}</h3>

          <div className="mt-4 space-y-2">
            {options.map((option, i) => {
              const key = getOptionKey(option);
              const isSelected = selected === key;
              const isCorrect = key === correctKey;

              let style = 'border-gray-200 bg-gray-50 hover:bg-gray-100';
              if (revealed && isCorrect) style = 'border-green-300 bg-green-50 text-green-900';
              else if (revealed && isSelected && !isCorrect) style = 'border-red-300 bg-red-50 text-red-900';

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(option)}
                  disabled={revealed}
                  className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${style} ${
                    revealed ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {revealed && question.explanation && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              <span className="font-semibold">Izoh: </span>
              {question.explanation}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function PracticalTaskCard({ task, index }) {
  return (
    <article className="rounded-lg border border-purple-200 bg-purple-50 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-200 text-sm font-bold text-purple-800">
          {task.number ?? index + 1}
        </span>
        <div>
          <h3 className="font-medium text-purple-900">{task.task}</h3>
          {task.hint && (
            <p className="mt-2 rounded-md bg-white/70 px-3 py-2 text-sm text-purple-800">
              <span className="font-semibold">Yordam: </span>
              {task.hint}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AssessmentView({ assessment }) {
  if (!assessment) return null;

  const questions = Array.isArray(assessment.questions) ? assessment.questions : [];
  const practicalTasks = Array.isArray(assessment.practical_tasks)
    ? assessment.practical_tasks
    : [];

  if (questions.length === 0 && practicalTasks.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Baholash va testlar</h2>
        <p className="mt-1 text-sm text-gray-500">
          Savollarni tanlang — to'g'ri javob va izoh ko'rsatiladi
        </p>
      </div>

      {questions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Test savollari</h3>
          {questions.map((q, i) => (
            <QuestionCard key={i} question={q} index={i} />
          ))}
        </div>
      )}

      {practicalTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Amaliy topshiriqlar</h3>
          {practicalTasks.map((task, i) => (
            <PracticalTaskCard key={i} task={task} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
