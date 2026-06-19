// src/pages/LessonCreate.jsx
import { useNavigate } from 'react-router-dom';
import { useLessonGeneration } from '../hooks/useLessonGeneration';
import { useState } from 'react';

// ── Konstantalar ─────────────────────────────────────────────────────────────
const SUBJECTS = [
  { value: 'math',        label: 'Matematika' },
  { value: 'physics',     label: 'Fizika' },
  { value: 'chemistry',   label: 'Kimyo' },
  { value: 'biology',     label: 'Biologiya' },
  { value: 'history',     label: 'Tarix' },
  { value: 'geography',   label: 'Geografiya' },
  { value: 'astronomy',   label: 'Astronomiya' },
  { value: 'programming', label: 'Dasturlash' },
  { value: 'other',       label: 'Boshqa' },
];

const LANGUAGES = [
  { value: 'uz', label: "O'zbek" },
  { value: 'ru', label: 'Rus' },
  { value: 'en', label: 'Ingliz' },
];

const DURATIONS = [30, 45, 60, 90];

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ progress, step }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Bar */}
      <div style={{
        background   : '#e5e7eb',
        borderRadius : '8px',
        height       : '10px',
        overflow     : 'hidden',
        marginBottom : '10px',
      }}>
        <div style={{
          width      : `${progress}%`,
          height     : '100%',
          background : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          borderRadius: '8px',
          transition : 'width 0.6s ease',
        }} />
      </div>

      {/* Foiz va qadam */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
        <span style={{ color: '#6b7280' }}>{step || 'Kutilmoqda…'}</span>
        <span style={{ fontWeight: 600, color: '#6366f1' }}>{progress}%</span>
      </div>

      {/* Foydalanuvchiga xabar */}
      <p style={{
        marginTop  : '12px',
        padding    : '10px 14px',
        background : '#f0fdf4',
        border     : '1px solid #86efac',
        borderRadius: '8px',
        color      : '#166534',
        fontSize   : '13px',
      }}>
        ✅ Sahifani yopishingiz mumkin — dars fon da yaratilmoqda.
        Qaytganingizda natija tayyor bo'ladi.
      </p>
    </div>
  );
}

// ── Asosiy Page ───────────────────────────────────────────────────────────────
export default function LessonCreate() {
  const navigate = useNavigate();

  const {
    generateLesson,
    reset,
    progress,
    step,
    lesson,
    error,
    isLoading,
    isCompleted,
    isFailed,
  } = useLessonGeneration();

  const [form, setForm] = useState({
    subject : 'math',
    grade   : 5,
    duration: 45,
    language: 'uz',
    prompt  : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'grade' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.prompt.trim()) return;
    generateLesson(form);
  };

  // ── Generatsiya tugadi → LessonDetail ga o'tish ───────────────────────────
  if (isCompleted && lesson) {
    navigate(`/lessons/${lesson.id}`, { replace: true });
    return null;
  }

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
        Yangi dars yaratish
      </h1>

      {/* Progress — faqat loading paytida */}
      {isLoading && (
        <ProgressBar progress={progress} step={step} />
      )}

      {/* Xato */}
      {isFailed && (
        <div style={{
          padding    : '12px 16px',
          background : '#fef2f2',
          border     : '1px solid #fca5a5',
          borderRadius: '8px',
          color      : '#991b1b',
          marginBottom: '16px',
        }}>
          <p>❌ {error}</p>
          <button
            onClick={reset}
            style={{
              marginTop  : '8px',
              padding    : '6px 16px',
              background : '#ef4444',
              color      : 'white',
              border     : 'none',
              borderRadius: '6px',
              cursor     : 'pointer',
            }}
          >
            Qayta urinish
          </button>
        </div>
      )}

      {/* Form — loading paytida disabled */}
      <form onSubmit={handleSubmit}>

        {/* Fan */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Fan
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            disabled={isLoading}
            style={selectStyle}
          >
            {SUBJECTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Sinf */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Sinf (1–11)
          </label>
          <input
            type="number"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            min={1}
            max={11}
            disabled={isLoading}
            style={inputStyle}
          />
        </div>

        {/* Davomiylik */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Davomiylik (daqiqa)
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {DURATIONS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => !isLoading && setForm(p => ({ ...p, duration: d }))}
                disabled={isLoading}
                style={{
                  padding    : '8px 18px',
                  borderRadius: '8px',
                  border     : '2px solid',
                  borderColor: form.duration === d ? '#6366f1' : '#e5e7eb',
                  background : form.duration === d ? '#eef2ff' : 'white',
                  color      : form.duration === d ? '#6366f1' : '#374151',
                  fontWeight : form.duration === d ? 600 : 400,
                  cursor     : isLoading ? 'not-allowed' : 'pointer',
                  opacity    : isLoading ? 0.6 : 1,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Til */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Dars tili
          </label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            disabled={isLoading}
            style={selectStyle}
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Prompt */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>
            Dars haqida yozing
          </label>
          <textarea
            name="prompt"
            value={form.prompt}
            onChange={handleChange}
            disabled={isLoading}
            rows={4}
            placeholder="Masalan: Kvadrat tenglamalar, grafik usuli bilan yechish..."
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !form.prompt.trim()}
          style={{
            width      : '100%',
            padding    : '14px',
            background : isLoading ? '#c7d2fe' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
            color      : 'white',
            border     : 'none',
            borderRadius: '10px',
            fontSize   : '16px',
            fontWeight : 600,
            cursor     : isLoading ? 'not-allowed' : 'pointer',
            transition : 'opacity 0.2s',
          }}
        >
          {isLoading ? `Yaratilmoqda… ${progress}%` : '✨ Dars yaratish'}
        </button>

      </form>
    </div>
  );
}

// ── Style obyektlari ──────────────────────────────────────────────────────────
const inputStyle = {
  width        : '100%',
  padding      : '10px 14px',
  border       : '1px solid #e5e7eb',
  borderRadius : '8px',
  fontSize     : '15px',
  outline      : 'none',
  boxSizing    : 'border-box',
};

const selectStyle = {
  ...inputStyle,
  background: 'white',
  cursor    : 'pointer',
};