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
      // Update local status so UI reflects pending state
      if (onStatusChange) onStatusChange();
      openAdminChat();
    } catch (err) {
      setError(err.response?.data?.detail || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Light glassmorphism backdrop */}
      <div 
        className="absolute inset-0 bg-slate-100/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-white flex flex-col items-center p-8 transform transition-all">
        
        {/* Subtle glow effect at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isPending ? (
          <div className="text-center w-full py-8 relative z-10">
            <div className="w-24 h-24 mx-auto mb-8 bg-amber-50 rounded-[2rem] flex items-center justify-center text-amber-500 border border-amber-100 shadow-sm relative">
              <div className="absolute inset-0 rounded-[2rem] bg-amber-400/20 animate-ping"></div>
              <svg className="w-10 h-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">
              To'lov tekshirilmoqda
            </h2>
            <p className="text-slate-500 mb-6 font-medium px-4 leading-relaxed text-sm">
              Sizning to'lovingiz admin tomonidan tasdiqlanishi kutilmoqda. Agar hali to'lovni amalga oshirmagan bo'lsangiz, quyidagi tugma orqali to'lov qiling.
            </p>

            <div className="space-y-3 px-2">
              <button
                onClick={() => {
                  const url = "https://my.click.uz/clickp2p/8B9793CF7A773C3F2295134981584A4589CB99419171778CCA59323E85CB6AEC";
                  if (window.Telegram?.WebApp?.openLink) {
                    window.Telegram.WebApp.openLink(url);
                  } else {
                    window.open(url, '_blank');
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all py-3.5 font-bold text-[15px] shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Click orqali to'lov qilish
              </button>

              <button
                onClick={() => {
                  const url = 'https://t.me/ismoilovf_oo5';
                  if (window.Telegram?.WebApp?.openTelegramLink) {
                    window.Telegram.WebApp.openTelegramLink(url);
                  } else {
                    window.open(url, '_blank');
                  }
                }}
                className="w-full px-8 py-3.5 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-colors font-bold text-sm shadow-sm"
              >
                Adminga skrinshot yuborish
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full relative z-10">
            {/* Header */}
            <div className="text-center mb-8 mt-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Premium Obuna
              </h2>
              <p className="text-sm text-slate-500 mt-3 font-medium px-2 leading-relaxed">
                Cheksiz darslar yaratish va barcha imkoniyatlardan foydalanish uchun obuna bo'ling
              </p>
            </div>

            {/* Pricing Card */}
            <div className="relative rounded-3xl p-7 mb-6 text-white shadow-xl shadow-blue-500/20 overflow-hidden group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
              
              {/* Glassmorphism reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 mix-blend-overlay"></div>
              
              {/* Card content */}
              <div className="relative z-10 text-center">
                <div className="text-[12px] text-white/90 uppercase tracking-[0.2em] font-bold mb-2">Oylik Obuna Narxi</div>
                <div className="text-4xl font-extrabold tracking-tight drop-shadow-md mb-6">
                  50 000 <span className="text-xl font-medium opacity-90">UZS</span>
                </div>
                
                <button
                  onClick={() => {
                    const url = "https://my.click.uz/clickp2p/8B9793CF7A773C3F2295134981584A4589CB99419171778CCA59323E85CB6AEC";
                    if (window.Telegram?.WebApp?.openLink) {
                      window.Telegram.WebApp.openLink(url);
                    } else {
                      window.open(url, '_blank');
                    }
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white text-blue-600 hover:bg-slate-50 active:scale-[0.98] transition-all py-3.5 font-bold text-[15px] shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Click orqali to'lov qilish
                </button>
              </div>
            </div>

            <div className="text-center mb-6 px-2">
              <p className="text-[13px] text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                👆 Dastlab yuqoridagi tugma orqali to'lovni amalga oshiring. So'ngra to'lov muvaffaqiyatli bo'lganligi haqidagi <strong className="text-indigo-600">skrinshotni</strong> yuboring.
              </p>
            </div>

            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 p-4 rounded-2xl mb-6 text-center font-semibold border border-rose-100">
                {error}
              </div>
            )}

            <button
              onClick={handleSendScreenshot}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 hover:bg-black active:scale-[0.98] transition-all text-white py-4.5 font-bold text-base shadow-lg shadow-slate-900/20 disabled:opacity-70 group"
              style={{ minHeight: '60px' }}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Skrinshotni yuborish</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
