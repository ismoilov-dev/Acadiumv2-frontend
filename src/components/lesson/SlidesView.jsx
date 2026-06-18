import { useState } from 'react';
import TeacherTipBox from './TeacherTipBox';

function SlideCard({ slide }) {
  const content = Array.isArray(slide.content) ? slide.content : [];

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md bg-orange-500 px-2.5 py-1 text-xs font-bold">
            {String(slide.number ?? '').padStart(2, '0')}
          </span>
          {slide.visual_hint && (
            <span className="text-xs text-blue-200">🖼 {slide.visual_hint}</span>
          )}
        </div>
        <h3 className="mt-3 text-xl font-bold leading-snug">{slide.title}</h3>
      </div>

      <div className="px-6 py-5">
        {content.length > 0 ? (
          <ul className="space-y-3">
            {content.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-0.5 text-primary-600">▶</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Kontent mavjud emas</p>
        )}

        {slide.teacher_note && (
          <div className="mt-4">
            <TeacherTipBox tip={slide.teacher_note} label="Slayd uchun eslatma" />
          </div>
        )}
      </div>
    </article>
  );
}

export default function SlidesView({ slidesData }) {
  const slides = Array.isArray(slidesData?.slides)
    ? slidesData.slides
    : Array.isArray(slidesData)
      ? slidesData
      : [];

  const [current, setCurrent] = useState(0);

  if (slides.length === 0) return null;

  const goPrev = () => setCurrent((i) => Math.max(0, i - 1));
  const goNext = () => setCurrent((i) => Math.min(slides.length - 1, i + 1));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Slaydlar</h2>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {slides.length} ta slayd
        </span>
      </div>

      <SlideCard slide={slides[current]} />

      {slides.length > 1 && (
        <>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={current === 0}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 tap-target flex items-center justify-center"
            >
              ← Oldingi
            </button>
            <span className="text-xs sm:text-sm font-medium text-gray-500">
              {current + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={current === slides.length - 1}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 tap-target flex items-center justify-center"
            >
              Keyingi →
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-left text-xs transition-all tap-target ${
                  i === current
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >

                <span className="font-bold">{slide.number ?? i + 1}</span>
                <span className="ml-1 line-clamp-1">{slide.title}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
