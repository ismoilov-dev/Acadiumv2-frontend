import { useState } from 'react';
import { authService } from '../services/authService';

export default function PremiumModal({ isOpen, onClose, user, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen || !user) return null;

  const isPending = user.has_pending_subscription;

  const handleSendScreenshot = async () => {
    const openAdminChat = () => {
      const url = 'https://t.me/ismoilovf_oo5';
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
      } else {
        window.open(url, '_blank');
      }
    };

    if (isPending) {
      openAdminChat();
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.requestPremium();
      if (onStatusChange) onStatusChange();
      openAdminChat();
    } catch (err) {
      setError(err.response?.data?.detail || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryClick = () => {
    // Redirect to placeholder URL for payment
    const url = "https://my.click.uz/clickp2p/8B9793CF7A773C3F2295134981584A4589CB99419171778CCA59323E85CB6AEC";
    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xl transition-opacity dark">
      {/* Modal Container */}
      <div className="relative w-full max-w-[900px] overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#0A0A0A] shadow-2xl flex flex-col md:flex-row transform transition-all animate-scale-in text-white border border-white/10">
        
        {/* Left Side - Benefits */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#0A0A0A]">
          {/* Subtle glow effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              🚀 Unlock Acadium Pro
            </h2>
            <p className="text-slate-400 text-[15px] leading-relaxed mb-8">
              Your first lesson has been generated successfully. Upgrade to Pro to unlock it and continue generating unlimited lessons.
            </p>

            <ul className="space-y-4">
              {[
                'Unlimited Lesson Generation',
                'Unlimited PPT Downloads',
                'Unlimited AI Assessments',
                'Unlimited Homework',
                'Faster AI Generation',
                'Priority Support'
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 font-medium text-[15px]">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side - Payment / Status */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white/5 backdrop-blur-md border-l border-white/5 relative">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {isPending ? (
            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-20 h-20 mb-6 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <svg className="w-10 h-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">⏳ Payment Under Review</h2>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-8 max-w-sm">
                Your payment is currently being reviewed by our administrator. Once approved, your Premium subscription will activate automatically.
              </p>
              <button
                onClick={handleSendScreenshot}
                className="w-full px-6 py-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-colors font-semibold text-[15px] border border-white/10"
              >
                Go to Administrator Chat
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              
              <div className="mb-8">
                <div className="text-indigo-400 font-bold tracking-wider text-xs uppercase mb-2">Acadium Pro</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold tracking-tight">50 000</span>
                  <span className="text-slate-400 font-medium">UZS / 1 Oy</span>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 mb-8">
                <p className="text-sm text-slate-300 leading-relaxed">
                  To'lovni amalga oshirish uchun pastdagi <strong className="text-white">"Click orqali to'lov qilish"</strong> tugmasini bosing. To'lov tugagach, to'lov cheki (skrinshot)ni <strong className="text-white">adminga yuboring</strong>.
                </p>
              </div>

              {error && (
                <div className="text-sm text-rose-400 bg-rose-500/10 p-3 rounded-xl mb-6 text-center font-medium border border-rose-500/20">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handlePrimaryClick}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white text-black hover:bg-slate-200 active:scale-[0.98] transition-all py-4 font-bold text-[15px] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Click orqali to'lov qilish
                </button>

                <button
                  onClick={handleSendScreenshot}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#2AABEE] hover:bg-[#2298D6] active:scale-[0.98] transition-all text-white py-4 font-bold text-[15px] shadow-[0_0_20px_rgba(42,171,238,0.2)] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.21 3.45-.49.33-.94.5-1.35.49-.45-.01-1.32-.26-1.96-.46-.79-.26-1.42-.4-1.36-.84.03-.22.34-.44.93-.67 3.65-1.59 6.09-2.64 7.31-3.14 3.48-1.42 4.2-1.67 4.67-1.68.1 0 .33.02.48.14.12.1.17.24.19.34.02.14.03.3.01.44z"/>
                      </svg>
                      Adminga skrinshot yuborish
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
