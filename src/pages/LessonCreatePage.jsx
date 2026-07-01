// src/pages/LessonCreatePage.jsx
import { useLessonGeneration } from "../hooks/useLessonGeneration";

export default function LessonCreatePage() {
  const {
    generateLesson,
    reset,
    progress,
    step,
    lesson,
    error,
    isLoading,
    isCompleted,
    isFailed,
  } = useLessonGeneration();

  const handleSubmit = (formData) => {
    generateLesson({
      language: formData.language,
      prompt  : formData.prompt,
    });
  };

  // ── Tayyor bo'lsa — natijani ko'rsat ──────────────────────────────────────
  if (isCompleted && lesson) {
    return (
      <div>
        <h2>{lesson.title}</h2>
        <p>Dars muvaffaqiyatli yaratildi!</p>
        <button onClick={reset}>Yangi dars yaratish</button>
        {/* 
          lesson.lesson_plan
          lesson.slides
          lesson.assessment
          — bularni o'zingizning mavjud komponentlaringizga uzating
        */}
      </div>
    );
  }

  return (
    <div>

      {/* ── Loading / Progress ── */}
      {isLoading && (
        <div>
          <div
            style={{
              height    : "8px",
              background: "#e5e7eb",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width     : `${progress}%`,
                height    : "100%",
                background: "#6366f1",
                borderRadius: "4px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <p>{progress}% — {step || "Kutilmoqda…"}</p>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            ✅ Sahifani yopishingiz mumkin —
            dars fon da yaratiladi. Qaytganingizda natija tayyor bo'ladi.
          </p>
        </div>
      )}

      {/* ── Xato ── */}
      {isFailed && (
        <div>
          <p style={{ color: "red" }}>❌ {error}</p>
          <button onClick={reset}>Qayta urinish</button>
        </div>
      )}

      {/* ── Form — faqat loading bo'lmaganda ── */}
      {!isLoading && !isCompleted && (
        <LessonForm onSubmit={handleSubmit} />
      )}

    </div>
  );
}