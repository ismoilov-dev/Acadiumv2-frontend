import LessonPlanView from "./LessonPlanView";
import SlidesView from "./SlidesView";
import AssessmentView from "./AssessmentView";

export default function LessonContent({
  lessonPlan,
  slides,
  assessment,
  status = "completed",
  isRetrying = false,
  failedStage,
  errorMessage,
  onRetry,
  onDownload,
  isDownloading,
}) {
  const hasContent = lessonPlan && slides && assessment;
  const isGenerating =
    ["pending", "processing", "generating"].includes(status) || isRetrying;

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mb-4" />
        <p className="text-sm font-medium text-gray-700">
          {isRetrying
            ? "Ma'lumotlar yuklanmoqda..."
            : "Dars kontenti yaratilmoqda..."}
        </p>
        <p className="text-xs text-gray-500 mt-2">Iltimos, biroz kuting</p>
      </div>
    );
  }

  if (status === "failed" || !hasContent) {
    let title = "Generation failed.";
    if (failedStage === "health_check") title = "AI Provider check failed.";
    else if (failedStage === "lesson_plan") title = "Lesson plan generation failed.";
    else if (failedStage === "slides") title = "Slides generation failed.";
    else if (failedStage === "assessment") title = "Assessment generation failed.";

    let desc = "The content for this lesson is incomplete or missing. Please try regenerating it.";
    if (errorMessage) {
      const lowerError = errorMessage.toLowerCase();
      if (lowerError.includes("503") || lowerError.includes("provider unavailable") || lowerError.includes("no providers available") || lowerError.includes("502")) {
        desc = "AI service is temporarily unavailable. Please try again in a few minutes.";
      } else {
        desc = errorMessage;
      }
    }

    return (
      <div className="flex flex-col items-center justify-center p-10 rounded-xl border border-dashed border-red-200 bg-red-50 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-3">
          <span className="text-xl">⚠️</span>
        </div>
        <h3 className="text-sm font-semibold text-red-800 mb-1">{title}</h3>
        <p className="text-xs text-red-600 mb-5 whitespace-pre-wrap max-w-md">
          {desc}
        </p>
        <button 
          onClick={onRetry ? onRetry : () => window.location.reload()}
          className="inline-flex items-center justify-center rounded-lg bg-white border border-red-200 px-5 py-2 text-sm font-medium text-red-700 hover:bg-red-50 shadow-sm transition-colors"
        >
          Regenerate Lesson
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {lessonPlan && <LessonPlanView plan={lessonPlan} />}
      {slides && <SlidesView slidesData={slides} onDownload={onDownload} isDownloading={isDownloading} />}
      {assessment && <AssessmentView assessment={assessment} />}
    </div>
  );
}
