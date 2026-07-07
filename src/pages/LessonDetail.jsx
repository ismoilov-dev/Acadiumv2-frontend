import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import StatusBadge from "../components/StatusBadge";
import LessonContent from "../components/lesson/LessonContent";
import FeedbackWidget from "../components/FeedbackWidget";
import PremiumModal from "../components/PremiumModal";
import { useAuth } from "../hooks/useAuth";
import { lessonService } from "../services/lessonService";
import { SUBJECTS, LANGUAGES } from "../utils/constants";
import { formatError } from "../utils/formatError";

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user, refreshUser } = useAuth();

  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const fetchLesson = async () => {
      try {
        const data = await lessonService.get(id);
        if (isMounted) {
          const isEmptyContent =
            !data.lesson_plan && !data.slides && !data.assessment;

          if (
            data.status === "completed" &&
            isEmptyContent &&
            retryCountRef.current < MAX_RETRIES
          ) {
            retryCountRef.current += 1;
            setLesson(data);
            setLoading(false);
            timeoutId = setTimeout(fetchLesson, 2000);
            return;
          }

          setLesson(data);
          setLoading(false);

          if (["processing", "pending", "generating"].includes(data.status)) {
            timeoutId = setTimeout(fetchLesson, 3000);
          } else {
            retryCountRef.current = 0;
          }
        }
      } catch (err) {
        if (isMounted) {
          if (err?.response?.data?.code === 'premium_required' || err?.response?.status === 402) {
             setShowPremiumModal(true);
             setLoading(false);
             return;
          }
          setError(formatError(err));
          setLoading(false);
        }
      }
    };

    fetchLesson();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bu darsni o'chirmoqchimisiz?")) return;
    setActionLoading("delete");
    try {
      await lessonService.delete(id);
      navigate("/lessons");
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoading("");
    }
  };

  const handleDownload = async () => {
    setActionLoading("download");
    try {
      // Request backend to send PPTX via Telegram — no browser download
      await lessonService.sendToTelegram(id);
      // Show success message
      setSuccess("✅ PPTX fayl Telegram chatga yuborildi.");
      
      // Request platform feedback naturally after success
      setTimeout(() => {
        window.dispatchEvent(new Event("trigger_platform_feedback"));
      }, 1500);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setActionLoading("");
    }
  };

  const handleFeedbackSubmit = async ({ rating, comment }) => {
    setSubmittingFeedback(true);
    try {
      await lessonService.submitFeedback(id, { rating, comment });
      setSuccess("✅ Fikringiz muvaffaqiyatli yuborildi. Rahmat!");
      setLesson((prev) => ({
        ...prev,
        has_feedback: true,
        total_feedback: prev.total_feedback + 1,
        // Calculate new average rating approximately or just re-fetch
      }));
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading)
    return (
      <MainLayout>
        <LoadingSpinner message="Dars yuklanmoqda..." />
      </MainLayout>
    );
  if (error && !lesson)
    return (
      <MainLayout>
        <ErrorMessage message={error} />
      </MainLayout>
    );
  if (!lesson) return null;

  const languageLabel = LANGUAGES.find(
    (l) => l.value === lesson.language,
  )?.label;

  return (
    <MainLayout>
      <div className="mb-4">
        <Link
          to="/lessons"
          className="text-sm text-primary-600 hover:underline"
        >
          ← Darslar ro'yxati
        </Link>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {lesson.title}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 font-medium">
              {languageLabel}
            </p>
            <p className="mt-1 text-2xs sm:text-xs text-gray-400">
              {new Date(lesson.created_at).toLocaleString("uz-UZ")}
            </p>
            
            {lesson.total_feedback > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <span className="flex items-center text-yellow-500 font-semibold">
                  ⭐ {lesson.average_rating} / 5
                </span>
                <span>·</span>
                <span>{lesson.total_feedback} ta fikr</span>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <StatusBadge status={lesson.status} />
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-gray-700">
            So'rov:
          </p>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
            {lesson.prompt}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {lesson.status === "completed" && (
            <>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!!actionLoading}
                className="rounded-lg bg-primary-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 tap-target flex items-center justify-center"
              >
                {actionLoading === "download"
                  ? "Yuklanmoqda..."
                  : "PPTX yuklab olish"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={!!actionLoading}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 tap-target flex items-center justify-center"
          >
            {actionLoading === "delete" ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>

      <LessonContent
        lessonPlan={lesson.lesson_plan}
        slides={lesson.slides}
        assessment={lesson.assessment}
        status={lesson.status}
        isRetrying={
          retryCountRef.current > 0 &&
          retryCountRef.current < MAX_RETRIES &&
          !lesson.lesson_plan &&
          !lesson.slides &&
          !lesson.assessment
        }
        onRetry={async () => {
          try {
            await lessonService.regenerate(lesson.id);
            window.location.reload();
          } catch (err) {
            alert(err);
          }
        }}
      />
      
      {lesson.status === "completed" && !lesson.has_feedback && (
        <FeedbackWidget 
          lessonId={lesson.id}
          onSubmit={handleFeedbackSubmit}
          isSubmitting={submittingFeedback}
        />
      )}

      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => {
          setShowPremiumModal(false);
          navigate("/lessons"); // Go back to list if they cancel premium modal on detail page
        }} 
        user={user}
        onStatusChange={refreshUser}
      />
    </MainLayout>
  );
}
