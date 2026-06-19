import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonService } from '../services/lessonService';
import { formatError } from '../utils/formatError';
import LessonContent from '../components/lesson/LessonContent';

export default function PublicLesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchPublicLesson = async () => {
      try {
        setLoading(true);
        const data = await lessonService.getPublic(id);
        if (isMounted) {
          setLesson(data);
          setLoading(false);

          // Inject Open Graph tags dynamically
          document.title = `${data.title || 'Dars'} - Acadium AI`;

          const setMeta = (property, content) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
              meta = document.createElement('meta');
              meta.setAttribute('property', property);
              document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
          };

          setMeta('og:title', data.title || 'Acadium AI Dars');
          setMeta('og:description', `Mavzu: ${data.subject || ''} ${data.grade ? data.grade + '-sinf' : ''}`);
          setMeta('og:site_name', 'Acadium AI');
          setMeta('og:type', 'article');
        }
      } catch (err) {
        if (isMounted) {
          setError(formatError(err));
          setLoading(false);
        }
      }
    };

    fetchPublicLesson();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[100dvh] w-full bg-slate-50 items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex h-[100dvh] w-full bg-slate-50 items-center justify-center p-6 text-center">
        <div className="max-w-md w-full">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Dars topilmadi</h2>
          <p className="text-slate-500 mb-6">{error || "Bu dars mavjud emas yoki ommaviy emas."}</p>
          <Link to="/" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 overflow-hidden font-sans text-slate-900">

      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 flex-shrink-0 items-center border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 tracking-tight">Acadium AI</span>
        </div>
        {/* <div className="ml-auto flex items-center gap-2">
          <Link to="/" className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
            {/* O'zingiz yaratish */}
          </Link>
        </div> */}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
        <div className="mx-auto max-w-3xl space-y-6 pb-12">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {lesson.title || "Noma'lum dars"}
            </h1>

            {(lesson.subject || lesson.grade || lesson.duration) && (
              <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-6">
                {lesson.subject && <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold capitalize">{lesson.subject}</span>}
                {lesson.grade && <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">{lesson.grade}-sinf</span>}
                {lesson.duration && <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">{lesson.duration} daqiqa</span>}
                <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md text-xs font-semibold ml-auto flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Ommaviy dars
                </span>
              </div>
            )}

            <div className="prose prose-sm sm:prose-base prose-indigo prose-slate max-w-none">
              <LessonContent
                lessonPlan={lesson.lesson_plan}
                slides={lesson.slides}
                assessment={lesson.assessment}
              />
            </div>
          </div>

          {/* <div className="text-center mt-8">
            {/* <p className="text-sm text-slate-500 mb-3">Siz ham shunday interaktiv darslar yaratmoqchimisiz?</p> */}
            <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm">
               Boshlash
            </Link>
          </div> */}

        </div>
      </main>

    </div>
  );
}
