import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorMessage from '../components/ErrorMessage';
import { lessonService } from '../services/lessonService';
import { SUBJECTS, LANGUAGES, DURATIONS, GRADES } from '../utils/constants';
import { formatError } from '../utils/formatError';

export default function LessonCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: 'math',
    grade: 5,
    duration: 45,
    language: 'uz',
    prompt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'grade' || name === 'duration' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const lesson = await lessonService.generate(form);
      navigate(`/lessons/${lesson.id}`);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-gray-900">Yangi dars yaratish</h1>

      <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <p className="mb-5 sm:mb-6 text-xs sm:text-sm text-gray-600">
          Dars mavzusini yozing — AI sizga dars rejasi, slaydlar va baholash materiallarini yaratadi.
        </p>


        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Dars mavzusi / so'rovingiz
            </label>
            <textarea
              id="prompt"
              name="prompt"
              required
              rows={4}
              value={form.prompt}
              onChange={handleChange}
              placeholder="Masalan: 5-sinf uchun kasrlar qo'shish va ayirish"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Fan
              </label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {SUBJECTS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Sinf
              </label>
              <select
                id="grade"
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}-sinf</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Davomiylik (daqiqa)
              </label>
              <select
                id="duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d} daqiqa</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Til
              </label>
              <select
                id="language"
                name="language"
                value={form.language}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {LANGUAGES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-600 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'AI dars yaratmoqda... (bu biroz vaqt olishi mumkin)' : 'Dars yaratish'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
