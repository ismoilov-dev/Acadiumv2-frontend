import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { useAuth } from '../hooks/useAuth';
import { formatError } from '../utils/formatError';
import ErrorMessage from '../components/ErrorMessage';
import LessonContent from '../components/lesson/LessonContent';
import StatusBadge from '../components/StatusBadge';
import ProfileDrawer from '../components/ProfileDrawer';

export default function ChatInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Sidebar state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Active lesson state
  const [lesson, setLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState('');

  // New prompt state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const bottomRef = useRef(null);

  // Fetch history
  const fetchHistory = async () => {
    try {
      const data = await lessonService.list();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Fetch & poll active lesson
  useEffect(() => {
    if (!id) {
      setLesson(null);
      setLessonError('');
      setLessonLoading(false);
      return;
    }

    let timeoutId;
    let isMounted = true;

    const fetchLesson = async () => {
      setLessonLoading(!lesson);
      try {
        const data = await lessonService.get(id);
        if (isMounted) {
          setLesson(data);
          setLessonLoading(false);

          if (data.status === 'processing' || data.status === 'pending') {
            timeoutId = setTimeout(fetchLesson, 3000);
          } else if (data.status === 'completed' || data.status === 'failed') {
            fetchHistory(); // Refresh history to update titles
          }
        }
      } catch (err) {
        if (isMounted) {
          setLessonError(formatError(err));
          setLessonLoading(false);
        }
      }
    };

    fetchLesson();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  // Scroll to bottom when lesson updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lesson, lessonLoading]);

  // Generate new lesson
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerateError('');
    try {
      const data = await lessonService.generate({ prompt });
      setPrompt('');
      setIsGenerating(false);
      navigate(`/lessons/${data.id}`);
      fetchHistory(); // Optimistic update
    } catch (err) {
      setGenerateError(formatError(err));
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!lesson) return;
    try {
      await lessonService.sendToTelegram(lesson.id);
      alert('✅ PPTX fayl Telegram chatga yuborildi.');
    } catch (err) {
      alert(formatError(err));
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans text-slate-900">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-slate-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-200 bg-slate-50">
          <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Acadium AI</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-3">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Yangi dars yaratish
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-300">
          <div className="px-2 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">O'tgan darslar</div>
          {historyLoading ? (
            <div className="px-2 text-sm text-slate-400">Yuklanmoqda...</div>
          ) : history.length === 0 ? (
            <div className="px-2 text-sm text-slate-400">Hali darslar yo'q</div>
          ) : (
            history.map((item) => (
              <Link
                key={item.id}
                to={`/lessons/${item.id}`}
                onClick={() => setIsSidebarOpen(false)}
                className={`block w-full rounded-lg px-3 py-2.5 text-sm transition-colors text-left truncate ${
                  id === item.id.toString() ? 'bg-indigo-100 text-indigo-900 font-medium' : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                {item.title || "Noma'lum dars"}
              </Link>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
           <button 
             onClick={() => setIsProfileOpen(true)} 
             className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-slate-200 transition-colors text-left group"
           >
              <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0 border border-slate-300 group-hover:border-indigo-400 transition-colors">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  (user?.full_name || user?.email)?.[0]?.toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-500 truncate">@{user?.username}</p>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] w-full bg-white relative">

        {/* Header (Mobile + Desktop title) */}
        <header className="sticky top-0 z-10 flex h-14 flex-shrink-0 items-center border-b border-slate-200 bg-white/80 backdrop-blur-md px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mr-3 lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1 font-semibold text-slate-800 truncate">
            {id && lesson ? lesson.title : 'Yangi dars'}
          </div>
          {lesson?.status === 'completed' && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              PPTX
            </button>
          )}
        </header>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div className="mx-auto max-w-3xl space-y-8 pb-32">

            {!id ? (
              <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
                <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Qanday dars o'tmoqchisiz?</h2>
                <p className="text-slate-500 mb-8 max-w-md">Mavzuni erkin tilda yozing. AI o'zi mos fan, sinf va rejalarni tuzib beradi.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['9-sinf Fizika yorug\'lik tezligi', 'Python CRUD amaliy dars', 'Ingliz tili Present Simple ochiq dars'].map(hint => (
                    <button key={hint} onClick={() => setPrompt(hint)} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
                      "{hint}"
                    </button>
                  ))}
                </div>
              </div>
            ) : lessonLoading ? (
               <div className="flex justify-center pt-10"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>
            ) : lessonError ? (
               <ErrorMessage message={lessonError} />
            ) : lesson ? (
              <>
                {/* User Prompt Bubble */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] text-sm leading-relaxed shadow-sm">
                    {lesson.prompt}
                  </div>
                </div>

                {/* AI Response Area */}
                <div className="flex justify-start">
                   <div className="flex items-start gap-4 max-w-full w-full">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm mt-1 hidden sm:flex">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 sm:p-6 shadow-sm overflow-hidden">
                        {(lesson.status === 'processing' || lesson.status === 'pending') ? (
                          <div className="flex items-center gap-3 text-slate-500 font-medium">
                            <div className="animate-pulse flex gap-1">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-200"></div>
                              <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-400"></div>
                            </div>
                            <span className="text-sm">Dars generatsiya qilinmoqda, kuting...</span>
                          </div>
                        ) : lesson.status === 'failed' ? (
                          <ErrorMessage message="Generatsiyada xatolik yuz berdi. Qaytadan urinib ko'ring." />
                        ) : (
                          <div className="w-full max-w-full prose prose-sm prose-indigo prose-slate">
                            {/* Metadata Badges */}
                            {(lesson.subject || lesson.grade) && (
                               <div className="flex flex-wrap gap-2 mb-6">
                                 {lesson.subject && <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold capitalize">{lesson.subject}</span>}
                                 {lesson.grade && <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{lesson.grade}-sinf</span>}
                                 {lesson.duration && <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{lesson.duration} daqiqa</span>}
                               </div>
                            )}
                            <LessonContent
                              lessonPlan={lesson.lesson_plan}
                              slides={lesson.slides}
                              assessment={lesson.assessment}
                            />
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              </>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 sm:pb-6 px-4">
          <div className="mx-auto max-w-3xl">
            {generateError && (
              <div className="mb-3">
                <ErrorMessage message={generateError} />
              </div>
            )}
            <form onSubmit={handleGenerate} className="relative flex items-end gap-2 bg-white rounded-2xl border border-slate-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all p-1.5 sm:p-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate(e);
                  }
                }}
                placeholder="Dars yaratish uchun prompt yozing..."
                className="w-full resize-none bg-transparent border-0 py-2.5 px-3 text-sm text-slate-900 focus:ring-0 max-h-32 scrollbar-thin outline-none"
                rows="1"
                disabled={isGenerating}
                style={{ minHeight: '44px' }}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="flex shrink-0 items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors"
              >
                {isGenerating ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                   <svg className="w-5 h-5 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                )}
              </button>
            </form>
            <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2">
              AI xato qilishi mumkin. O'quvchilarga taqdim etishdan oldin tekshirib chiqing.
            </p>
          </div>
        </div>

      </main>

      {/* Profile Drawer */}
      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
}
