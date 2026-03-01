import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute = () => {
    const { isAuthenticated, authReady, user } = useAuth();
    const location = useLocation();

    if (!authReady) {
        return null;
    }

    if (isAuthenticated === false) {
        return <Navigate to="/welcome" replace state={{ from: location }} />;
    }

    // Force Onboarding if not completed
    if (user && !user.isOnboardingCompleted && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    // Prevent re-visiting onboarding if completed
    if (user && user.isOnboardingCompleted && location.pathname === '/onboarding') {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};
