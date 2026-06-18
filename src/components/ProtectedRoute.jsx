import { Navigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { loading } = useAuth();
  const token = storage.getAccessToken();

  if (loading) return <LoadingSpinner />;
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
