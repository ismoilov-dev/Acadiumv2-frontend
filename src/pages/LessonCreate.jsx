import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorMessage from "../components/ErrorMessage";
import { lessonService } from "../services/lessonService";
import { formatError } from "../utils/formatError";
import { useAuth } from "../hooks/useAuth";
import PremiumModal from "../components/PremiumModal";

export default function LessonCreate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user, refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Check Premium limits
    if (user && !user.is_premium && user.free_generations <= 0) {
      setShowPremiumModal(true);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const lesson = await lessonService.generate({ prompt });
      if (user && !user.is_premium) {
        await refreshUser(); // Update free_generations local state
      }
      navigate(`/lessons/${lesson.id}`);
    } catch (err) {
      if (err?.response?.data?.code === 'premium_required' || err?.response?.status === 402) {
        setShowPremiumModal(true);
        if (user && !user.is_premium) await refreshUser();
      } else {
        setError(formatError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-2 sm:px-4 w-full">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 w-full">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm border border-indigo-100">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Yangi dars yaratish
            </h1>
            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Dars mavzusini erkin yozing. AI avtomatik ravishda dars rejasi, slaydlar va baholashni tayyorlaydi.
            </p>

            {/* Free Plan Progress Bar */}
            {user && !user.is_premium && (
              <div className="mt-8 flex flex-col items-center max-w-sm mx-auto bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎁</span>
                  <span className="font-semibold text-slate-700">Bepul ta'rif</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${user.free_generations === 0 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                    style={{ width: `${((3 - user.free_generations) / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm font-medium text-slate-500">
                  <span className={user.free_generations === 0 ? 'text-rose-500 font-bold' : 'text-indigo-600'}>
                    {3 - user.free_generations}
                  </span> / 3 dars ishlatildi
                </div>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="w-full relative">
            {error && (
              <div className="mb-6 w-full">
                <ErrorMessage message={error} />
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="w-full relative group z-10">
              <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-500 ${loading ? 'opacity-40 animate-pulse' : ''}`}></div>
              
              <div className="relative flex flex-col sm:flex-row bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 p-2 sm:p-2.5">
                <input
                  type="text"
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
                  placeholder="Masalan: Python CRUD"
                  className="w-full flex-1 appearance-none bg-transparent py-4 px-6 text-lg sm:text-xl text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
                  autoFocus
                />
                
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="mt-2 sm:mt-0 flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-md hover:bg-indigo-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Yaratilmoqda...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Dars Yaratish
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Quick Suggestions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-sm font-medium text-slate-400 w-full text-center sm:w-auto sm:text-left mb-2 sm:mb-0">Tezkor misollar:</span>
              {['9-sinf Fizika yorug\'lik', 'Ingliz tili Present Simple', 'Tarix Temuriylar davri'].map(hint => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setPrompt(hint)}
                  disabled={loading}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs sm:text-sm font-medium hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-50"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        user={user}
        onStatusChange={refreshUser}
      />
    </MainLayout>
  );
}
