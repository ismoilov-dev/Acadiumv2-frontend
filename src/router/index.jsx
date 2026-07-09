import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ChatInterface from '../pages/ChatInterface';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PublicLesson from '../pages/PublicLesson';
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

      {/* Public Share Route */}
      <Route path="/public/lesson/:id" element={<PublicLesson />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
      <Route path="/lessons/:id" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
