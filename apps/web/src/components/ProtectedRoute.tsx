import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isAuthLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for auth to initialize
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying session...</p>
        </motion.div>
      </div>
    );
  }

  // 2. Double check token existence if context state is lagging
  const token = localStorage.getItem('femo_access_token') || localStorage.getItem('token');

  // 3. Mandatory Redirection if definitely NOT authenticated
  if (!isAuthenticated && !token) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }

  // 4. Force Onboarding if not completed
  if (user && !user.isOnboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // 5. Prevent re-visiting onboarding if completed
  if (user && user.isOnboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/home" replace />;
  }

  // 6. Final safety check: if we somehow got here without auth and no token in localStorage
  if (!isAuthenticated && !token) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};


