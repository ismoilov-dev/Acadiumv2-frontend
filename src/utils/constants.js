export const API_BASE_URL = 'https://acadium.duckdns.org/api/';

export const SUBJECTS = [
  { value: 'math', label: 'Matematika' },
  { value: 'physics', label: 'Fizika' },
  { value: 'chemistry', label: 'Kimyo' },
  { value: 'biology', label: 'Biologiya' },
  { value: 'history', label: 'Tarix' },
  { value: 'geography', label: 'Geografiya' },
  { value: 'astronomy', label: 'Astronomiya' },
  { value: 'programming', label: 'Dasturlash' },
  { value: 'other', label: 'Boshqa' },
];

export const LANGUAGES = [
  { value: 'uz', label: "O'zbek" },
  { value: 'ru', label: 'Rus' },
  { value: 'en', label: 'Ingliz' },
];

export const DURATIONS = [30, 45, 60, 90];

export const GRADES = Array.from({ length: 11 }, (_, i) => i + 1);

export const STATUS_LABELS = {
  pending: 'Kutmoqda',
  processing: 'Yaratilmoqda',
  completed: 'Tayyor',
  failed: 'Xatolik',
};

export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};
