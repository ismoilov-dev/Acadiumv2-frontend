import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { useAuth } from '../hooks/useAuth';
import { formatError } from '../utils/formatError';
import ErrorMessage from '../components/ErrorMessage';
import LessonContent from '../components/lesson/LessonContent';
import StatusBadge from '../components/StatusBadge';
import ProfileDrawer from '../components/ProfileDrawer';
import ComingSoonModal from '../components/ComingSoonModal';
import GlobalPlatformFeedback from '../components/GlobalPlatformFeedback';

export default function ChatInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Sidebar state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  // Active lesson state
  const [lesson, setLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonError, setLessonError] = useState('');

  // New prompt state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [progress, setProgress] = useState(0);

  // Context Menu and Modals state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, lessonId: null, lessonTitle: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState('');
  const [actionLesson, setActionLesson] = useState(null);

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

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedStr = localStorage.getItem('acadium_generation');
    if (savedStr) {
      try {
        const saved = JSON.parse(savedStr);
        if (saved.lesson_id && (saved.generation_status === 'processing' || saved.generation_status === 'pending')) {
          setProgress(saved.progress || 0);
          if (!id) {
            navigate(`/lessons/${saved.lesson_id}`);
          }
        }
      } catch (e) {
        console.error('Failed to parse generation state', e);
      }
    }
  }, [id, navigate]);

  // Fetch & poll active lesson
  useEffect(() => {
    if (!id) {
      setLesson(null);
      setLessonError('');
      setLessonLoading(false);
      return;
    }

    setLesson(null);
    setLessonLoading(true);
    setLessonError('');

    let timeoutId;
    let isMounted = true;

    const fetchLesson = async () => {
      try {
        const data = await lessonService.get(id);
        if (!isMounted) return;

        setLesson(data);
        setLessonLoading(false);
        
        // Make sure isGenerating is forcefully reset if the lesson is completed or failed
        if (data.status === 'completed' || data.status === 'failed') {
           setIsGenerating(false);
        }

        if (data.status === 'processing' || data.status === 'pending') {
          // Keep localStorage updated with actual server status
          const savedStr = localStorage.getItem('acadium_generation');
          const saved = savedStr ? JSON.parse(savedStr) : { progress: 0 };
          localStorage.setItem('acadium_generation', JSON.stringify({
            ...saved,
            lesson_id: data.id,
            generation_status: data.status,
          }));
          
          timeoutId = setTimeout(fetchLesson, 3000);
        } else if (data.status === 'completed' || data.status === 'failed') {
          localStorage.removeItem('acadium_generation');
          fetchHistory(); // Refresh history to update titles
        }
      } catch (err) {
        if (isMounted) {
          setLessonError(formatError(err));
          setLessonLoading(false);
          setIsGenerating(false);
          localStorage.removeItem('acadium_generation');
        }
      }
    };

    fetchLesson();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id]);

  // Simulate progress when generating
  useEffect(() => {
    let interval;
    const isActive = isGenerating || lesson?.status === 'processing' || lesson?.status === 'pending';
    
    if (isActive) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev >= 90 ? 90 : prev + Math.floor(Math.random() * 5) + 1;
          const currentStep = newProgress < 30 ? 'Analyzing prompt' : newProgress < 60 ? 'Structuring lesson' : newProgress < 90 ? 'Generating content' : 'Finalizing';
          
          // Persist incremental progress safely
          const savedStr = localStorage.getItem('acadium_generation');
          if (savedStr) {
            try {
              const saved = JSON.parse(savedStr);
              saved.progress = newProgress;
              saved.current_step = currentStep;
              localStorage.setItem('acadium_generation', JSON.stringify(saved));
            } catch (e) {}
          }
          
          return newProgress;
        });
      }, 1000);
    } else if (lesson?.status === 'completed') {
      setProgress(100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating, lesson?.status]);

  // Scroll to bottom when lesson updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lesson, lessonLoading]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerateError('');
    setProgress(0);
    try {
      const data = await lessonService.generate({ prompt });
      setPrompt('');
      
      // Store initial generation state
      localStorage.setItem('acadium_generation', JSON.stringify({
        lesson_id: data.id,
        generation_status: 'pending',
        progress: 0,
        current_step: 'Analyzing prompt'
      }));

      navigate(`/lessons/${data.id}`);
      fetchHistory(); // Optimistic update
      // We deliberately keep isGenerating true here to prevent flickering. 
      // It will be reset to false when fetchLesson completes.
    } catch (err) {
      setGenerateError(formatError(err));
      setIsGenerating(false);
      localStorage.removeItem('acadium_generation');
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

  const handleShare = () => {
    if (!lesson) return;
    
    const publicUrl = `${window.location.origin}/public/lesson/${lesson.id}`;
    const text = `📚 ${lesson.title || 'Ochiq dars'}\n\nOpen lesson:\n${publicUrl}`;
    
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(`📚 ${lesson.title || 'Ochiq dars'}\n\nOpen lesson:`)}`;
    
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(tgUrl);
    } else {
      window.open(tgUrl, '_blank');
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      lessonId: item.id,
      lessonTitle: item.title,
    });
  };

  let longPressTimer;
  const handleTouchStart = (e, item) => {
    longPressTimer = setTimeout(() => {
      const touch = e.touches[0];
      setContextMenu({ visible: true, x: touch.clientX, y: touch.clientY, lessonId: item.id, lessonTitle: item.title });
    }, 500);
  };
  const handleTouchEnd = () => { if (longPressTimer) clearTimeout(longPressTimer); };
  const handleTouchMove = () => { if (longPressTimer) clearTimeout(longPressTimer); };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const handleDeleteLesson = async () => {
    if (!actionLesson) return;
    try {
      await lessonService.delete(actionLesson.id);
      setHistory(prev => prev.filter(l => l.id !== actionLesson.id));
      setDeleteModalOpen(false);
      if (id === actionLesson.id.toString()) {
        navigate('/');
      }
    } catch (err) {
      alert(formatError(err));
    }
  };

  const handleRenameLesson = async (e) => {
    e.preventDefault();
    if (!actionLesson || !renameTitle.trim()) return;
    try {
      await lessonService.update(actionLesson.id, { title: renameTitle });
      setHistory(prev => prev.map(l => l.id === actionLesson.id ? { ...l, title: renameTitle } : l));
      if (id === actionLesson.id.toString() && lesson) {
        setLesson({ ...lesson, title: renameTitle });
      }
      setRenameModalOpen(false);
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

        <div className="p-3 flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Yangi dars yaratish
          </Link>
          
          <button
            onClick={() => setIsComingSoonOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-2.5 text-sm font-bold text-white shadow-sm hover:from-purple-600 hover:to-indigo-600 transition-all border border-purple-400/30 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10 flex items-center gap-2 tracking-wide">
              <span className="text-base leading-none">✨</span>
              Coming Soon
            </span>
          </button>
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
                onContextMenu={(e) => handleContextMenu(e, item)}
                onTouchStart={(e) => handleTouchStart(e, item)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
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
                {(lesson.status === 'completed' || lesson.status === 'failed') && (
                  <div className="flex justify-start">
                     <div className="flex items-start gap-4 max-w-full w-full">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm mt-1 hidden sm:flex">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
                        </div>
                        <div className="flex-1 bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 sm:p-6 shadow-sm overflow-hidden">
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
                                status={lesson.status}
                                failedStage={lesson.failed_stage}
                                errorMessage={lesson.error_message}
                                onRetry={async () => {
                                  if (!lesson || !lesson.prompt) return;
                                  try {
                                    const res = await lessonService.generate({ prompt: lesson.prompt });
                                    if (res && res.id) {
                                      navigate(`/lessons/${res.id}`);
                                    } else {
                                      window.location.reload();
                                    }
                                  } catch(err) {
                                    alert(formatError(err));
                                  }
                                }}
                              />
                            </div>
                      </div>
                   </div>
                </div>
                )}
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
            
            {(isGenerating || lesson?.status === 'processing' || lesson?.status === 'pending') ? (
              <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-4 sm:p-5 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-semibold text-indigo-700">Generating lesson...</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">AI is preparing your lesson.</p>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                   <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-xs font-medium text-slate-400">{progress}% • {progress < 30 ? 'Analyzing prompt' : progress < 60 ? 'Structuring lesson' : progress < 90 ? 'Generating content' : 'Finalizing'}</div>
              </div>
            ) : (lesson?.status === 'completed' && id) ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 justify-center pb-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-indigo-600 text-white rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Share Lesson
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-slate-100 text-slate-800 rounded-xl py-3.5 font-medium flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors shadow-sm text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    PPTX Download
                  </button>
                </div>
              </div>
            ) : (!id) ? (
              <div className="flex flex-col gap-3">
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
                  placeholder="Yangi dars yaratish uchun prompt yozing..."
                  className="w-full resize-none bg-transparent border-0 py-2.5 px-3 text-sm text-slate-900 focus:ring-0 max-h-32 scrollbar-thin outline-none disabled:text-slate-400 disabled:cursor-not-allowed"
                  rows="1"
                  disabled={isGenerating}
                  style={{ minHeight: '44px' }}
                />
                
                <button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className="flex shrink-0 items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-300 transition-colors"
                >
                  <svg className="w-5 h-5 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                </form>
                <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-1">
                  AI xato qilishi mumkin. O'quvchilarga taqdim etishdan oldin tekshirib chiqing.
                </p>
              </div>
            ) : null}
          </div>
        </div>

      </main>

      {/* Profile Drawer */}
      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={isComingSoonOpen} 
        onClose={() => setIsComingSoonOpen(false)} 
      />

      {/* Platform Feedback */}
      <GlobalPlatformFeedback />

      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          className="fixed z-50 min-w-[160px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
            onClick={() => {
              setActionLesson({ id: contextMenu.lessonId, title: contextMenu.lessonTitle });
              setRenameTitle(contextMenu.lessonTitle);
              setRenameModalOpen(true);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Rename
          </button>
          <div className="h-px bg-slate-100 my-1"></div>
          <button 
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            onClick={() => {
              setActionLesson({ id: contextMenu.lessonId, title: contextMenu.lessonTitle });
              setDeleteModalOpen(true);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete lesson?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteLesson}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <form onSubmit={handleRenameLesson} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Rename lesson</h3>
            <input 
              type="text" 
              value={renameTitle}
              onChange={(e) => setRenameTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-6 text-sm outline-none"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => setRenameModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!renameTitle.trim()}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Rename
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
