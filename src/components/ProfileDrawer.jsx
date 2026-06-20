import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, refreshUser } = useAuth();
  
  const [form, setForm] = useState({
    full_name: '',
    email: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (user && isOpen) {
      setForm({
        full_name: user.full_name || '',
        email: user.email || '',
      });
      setAvatar(null);
      setAvatarPreview(null);
      setToast({ show: false, message: '', type: 'success' });
    }
  }, [user, isOpen]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('full_name', form.full_name);
      data.append('email', form.email);
      if (avatar) data.append('avatar', avatar);

      await authService.updateProfile(data);
      await refreshUser();
      showToast('Profil muvaffaqiyatli yangilandi!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white sm:rounded-l-2xl shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Profil sozlamalari</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* Toast Notification */}
          {toast.show && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {toast.type === 'success' ? (
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {toast.message}
            </div>
          )}

          {/* User Info Overview */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
                {(avatarPreview || user?.profile_image) ? (
                  <img 
                    src={avatarPreview || user.profile_image} 
                    alt="Avatar" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user?.full_name || user?.email)?.[0]?.toUpperCase()
                )}
              </div>
              
              {/* Upload Overlay */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Editable Fields */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">To'liq ism</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Foydalanuvchi nomi</label>
              <input
                type="text"
                value={user?.username || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none cursor-not-allowed"
                disabled
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Ro'yxatdan o'tgan sana</label>
              <input
                type="text"
                value={user?.created_at ? formatDate(user.created_at) : ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none cursor-not-allowed"
                disabled
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  'O\'zgarishlarni saqlash'
                )}
              </button>
            </div>
          </form>

          {/* Upcoming AI Features */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              🚀 Upcoming AI Features
            </h3>
            
            <div className="space-y-4">
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 relative shadow-sm pointer-events-none">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🎬</div>
                  <h4 className="font-bold text-slate-800 pr-20">AI Video Generator</h4>
                </div>
                <p className="text-sm text-slate-600 mb-4">Generate educational videos automatically from lessons.</p>
                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Features planned:</p>
                  <ul className="text-xs text-slate-500 space-y-1.5">
                    <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-400"></div> AI generated narration</li>
                    <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-400"></div> Animated scenes</li>
                    <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-400"></div> Educational storytelling</li>
                    <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-400"></div> Export MP4</li>
                  </ul>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 relative shadow-sm pointer-events-none">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🌍</div>
                  <h4 className="font-bold text-slate-800 pr-20">3D Geography Visualizer</h4>
                </div>
                <p className="text-sm text-slate-600 mb-4">Generate interactive geography visualizations.</p>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Examples:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Oceans', 'Seas', 'Mountains', 'Rivers', 'Countries', 'Earth visualization'].map(i => (
                        <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600">{i}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Future rendering:</p>
                    <ul className="text-xs text-slate-500 space-y-1.5">
                      <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-400"></div> Blender</li>
                      <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-400"></div> 3ds Max</li>
                      <li className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-indigo-400"></div> AI generated 3D scenes</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
                    <div className="text-xs space-y-2.5">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">"Pacific Ocean"</span>
                        <div className="flex items-center gap-2 text-indigo-600">
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          <span>AI creates animated ocean visualization</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-700">"Amazon River"</span>
                        <div className="flex items-center gap-2 text-indigo-600">
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          <span>AI creates 3D river animation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-4 relative shadow-sm pointer-events-none">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🎓</div>
                  <h4 className="font-bold text-slate-800 pr-20">AI Classroom Assistant</h4>
                </div>
                <p className="text-sm text-slate-600">Track student activity and learning progress.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
