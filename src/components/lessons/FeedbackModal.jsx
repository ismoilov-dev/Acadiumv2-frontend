import { useState } from "react";
import { Star } from "lucide-react";

export default function FeedbackModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Ushbu dars sizga qanchalik foydali bo'ldi?
          </h2>
          <p className="text-sm text-gray-500">
            Fikringiz biz uchun muhim, darslarimizni yanada yaxshilashga yordam bering!
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
              placeholder="Fikringizni yozing..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors tap-target"
            >
              Yopish
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors tap-target"
            >
              {isSubmitting ? "Yuborilmoqda..." : "Feedback yuborish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
