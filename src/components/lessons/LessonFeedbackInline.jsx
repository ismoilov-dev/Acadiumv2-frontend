import { useState } from "react";
import { Star } from "lucide-react";

export default function LessonFeedbackInline({ onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50/30 p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Ushbu dars sizga qanchalik foydali bo'ldi?
        </h2>
        <p className="text-sm text-gray-500">
          Fikringiz biz uchun muhim, darslarimizni yanada yaxshilashga yordam bering!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none transition-all shadow-sm"
            rows={3}
            placeholder="Fikringizni yozing..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="w-full rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors tap-target shadow-sm"
          >
            {isSubmitting ? "Yuborilmoqda..." : "Feedback yuborish"}
          </button>
        </div>
      </form>
    </div>
  );
}
