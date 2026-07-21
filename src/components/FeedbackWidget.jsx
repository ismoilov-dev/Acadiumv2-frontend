import { useState, useEffect } from 'react';

export default function FeedbackWidget({ lessonId, onSubmit, isSubmitting, externalOpen, onCloseExternal }) {
  const [isOpen, setIsOpen] = useState(false); // Modal state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    setIsOpen(true);
  };

  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    await onSubmit({ rating, comment });
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 2500);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
    setRating(0);
    setComment('');
    // Optionally show toast again, or just hide entirely.
  };

  if (submitted && !isOpen) return null;

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={handleCancel}
          />
          
          <div className="relative w-full max-w-sm rounded-[2rem] bg-white shadow-2xl border border-white/20 p-6 sm:p-8 transform transition-all animate-scale-in">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Thank you!</h3>
                <p className="text-sm text-slate-500 font-medium">Your feedback has been received.</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleCancel}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Share your feedback
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium px-2">
                    Your feedback helps us improve Acadium AI.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <svg
                        className={`w-10 h-10 ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 drop-shadow-sm'
                            : 'text-slate-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or what can be improved..."
                    className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3.5 rounded-xl text-[15px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 px-4 py-3.5 rounded-xl text-[15px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
