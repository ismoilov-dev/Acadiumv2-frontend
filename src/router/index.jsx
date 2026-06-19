import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import LessonList from '../pages/LessonList';
import LessonCreate from '../pages/LessonCreate';
import LessonDetail from '../pages/LessonDetail';
import { storage } from '../utils/storage';
import { isTelegram } from '../services/telegramAuth';

function GuestRoute({ children }) {
  if (storage.getAccessToken() || isTelegram()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/lessons" element={<ProtectedRoute><LessonList /></ProtectedRoute>} />
      <Route path="/lessons/create" element={<Navigate to="/lessons/generate" replace />} />
      <Route path="/lessons/generate" element={<ProtectedRoute><LessonCreate /></ProtectedRoute>} />
      <Route path="/lessons/:id" element={<ProtectedRoute><LessonDetail /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
