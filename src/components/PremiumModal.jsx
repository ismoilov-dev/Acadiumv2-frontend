import { useState } from 'react';
import { authService } from '../services/authService';

export default function PremiumModal({ isOpen, onClose, user, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen || !user) return null;

  const isPending = user.has_pending_subscription;

  const handleSendScreenshot = async () => {
    if (isPending) {
      window.open('https://t.me/placeholder_username', '_blank');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.requestPremium();
      // Update local status so UI reflects pending state
      if (onStatusChange) onStatusChange();
      window.open('https://t.me/placeholder_username', '_blank');
    } catch (err) {
      setError(err.response?.data?.detail || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/90 shadow-2xl backdrop-blur-xl border border-white/20 dark:bg-slate-900/90 dark:border-slate-700/50 flex flex-col items-center p-6 sm:p-8 transform transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isPending ? (
          <div className="text-center w-full py-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-500 animate-pulse">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Kutilmoqda...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Sizning to'lovingiz admin tomonidan tasdiqlanishi kutilmoqda. Tez orada premium faollashadi.
            </p>
            <button
              onClick={() => window.open('https://t.me/placeholder_username', '_blank')}
              className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
            >
              Telegram orqali bog'lanish
            </button>
          </div>
        ) : (
          <div className="w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4 shadow-lg shadow-indigo-500/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Acadium Premium
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Sizning bepul limitlaringiz tugadi. Cheksiz darslar yaratish uchun premium xarid qiling.
              </p>
            </div>

            <div className="space-y-3 mb-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-4">
              {[
                'Cheksiz dars generatsiyasi',
                'Cheksiz PPT eksporti',
                'Kengaytirilgan AI vositalari',
                'Premium yordam'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 mb-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.004 21.01h20.003v-2.003H2.004v2.003zM22.007 6.002h-20.003v2.003h20.003V6.002z"/>
                </svg>
              </div>
              <div className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">Oylik to'lov</div>
              <div className="text-3xl font-bold mb-4">50 000 <span className="text-base font-normal text-slate-400">UZS</span></div>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-slate-700/50 relative z-10">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Karta raqami</div>
                  <div className="font-mono tracking-widest text-lg">8600 **** **** ****</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Karta egasi</div>
                  <div className="font-medium tracking-wide">JOHN DOE</div>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-2 px-4 rounded-xl inline-block">
                👆 Yuqoridagi kartaga <strong className="font-bold text-indigo-700 dark:text-indigo-300">50 000 UZS</strong> o'tkazing
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-4 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleSendScreenshot}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white py-4 font-bold text-base shadow-lg shadow-indigo-500/30 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>📸 Skrinshotni Adminga Yuborish</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
