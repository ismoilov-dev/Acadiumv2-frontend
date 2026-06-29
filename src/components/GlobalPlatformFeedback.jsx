import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { authService } from "../services/authService";

export default function GlobalPlatformFeedback() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Determine if we should show the modal
    const checkTriggers = () => {
      // TEMPORARY FOR TESTING: bypass all checks
      setIsOpen(true);
      return true;
      
      const submittedAt = localStorage.getItem("acadium_platform_feedback_submitted_at");
      if (submittedAt) {
        const submittedDate = new Date(submittedAt);
        const daysSinceSubmit = (Date.now() - submittedDate.getTime()) / (1000 * 60 * 60 * 24);
        // Wait 30 days before asking again if they already submitted
        if (daysSinceSubmit < 30) return false;
      }

      const dismissedAt = localStorage.getItem("acadium_platform_feedback_dismissed_at");
      if (dismissedAt) {
        const dismissedDate = new Date(dismissedAt);
        const daysSinceDismiss = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        // Wait 7 days before asking again if they dismissed
        if (daysSinceDismiss < 7) return false;
      }

      const generatedLessons = parseInt(localStorage.getItem("acadium_generated_lessons") || "0", 10);
      
      const sessionStartStr = localStorage.getItem("acadium_session_start");
      let sessionStart = sessionStartStr ? new Date(sessionStartStr) : new Date();
      if (!sessionStartStr) {
        localStorage.setItem("acadium_session_start", sessionStart.toISOString());
      }
      const minsInSession = (Date.now() - sessionStart.getTime()) / (1000 * 60);

      // Trigger conditions:
      // 1. Generated 3 or more lessons
      // 2. Spent 5+ mins in current session
      // TEMPORARY: show immediately for testing
      setIsOpen(true);
      return true;
    };

    // Check immediately
    if (checkTriggers()) return;

    // And then check periodically every minute
    const interval = setInterval(() => {
      if (checkTriggers()) {
        clearInterval(interval);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("acadium_platform_feedback_dismissed_at", new Date().toISOString());
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await authService.submitPlatformFeedback({ rating, comment });
      setIsSuccess(true);
      localStorage.setItem("acadium_platform_feedback_submitted_at", new Date().toISOString());
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setRating(0);
        setComment("");
      }, 3000);
    } catch (err) {
      console.error("Platform feedback failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Rahmat!</h2>
            <p className="text-sm text-gray-600">
              Fikringiz muvaffaqiyatli saqlandi. Bu Acadium'ni yaxshilashda bizga katta yordam beradi.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                🎓 Acadium haqida fikringiz biz uchun muhim
              </h2>
              <p className="text-sm text-gray-500">
                Platformadan foydalanish tajribangiz qanday? Sizning fikringiz Acadium'ni yaxshilashga yordam beradi.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95 tap-target"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-transparent text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment Field */}
              <div className="mb-6">
                <textarea
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none transition-all"
                  rows={3}
                  placeholder="Nima yoqdi yoki nimani yaxshilashimiz kerak?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors tap-target"
                >
                  Keyinroq
                </button>
                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors tap-target"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
