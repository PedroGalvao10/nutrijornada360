import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContextCore';

export function ProtectedRoute() {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span></div>;
  }

  if (!isAdmin) {
    // Redireciona usuários deslogados disfarçando que a rota existe
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

