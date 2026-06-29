import { useState, useEffect } from "react";
const Star = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const MessageCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary-700 transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5" />
        Fikr bildirish
      </button>
    );
  }

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
