import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const PublicRoute = () => {
    const { isAuthenticated, authReady } = useAuth();

    if (!authReady) {
        return null;
    }

    if (isAuthenticated === true) {
        const pendingAction = localStorage.getItem('pendingSupportAction');
        if (pendingAction === 'chat') {
            localStorage.removeItem('pendingSupportAction');
            return <Navigate to="/chat?support=true" replace />;
        }
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};
