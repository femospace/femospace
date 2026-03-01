import { Navigate, useLocation } from 'react-router-dom';



export const RootRedirect = () => {
    // Read directly from localStorage for instant routing decisions avoids loading flicker
    const token = localStorage.getItem('femo_access_token') || localStorage.getItem('token');
    const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
    const location = useLocation();

    // 1. Not Logged In -> Welcome
    if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
        return <Navigate to="/welcome" replace state={{ from: location }} />;
    }

    // 2. Logged In AND Profile NOT Completed -> /profile/setup (or /onboarding)
    // Note: 'profileCompleted' might strictly mean we check that key.
    if (!profileCompleted) {
        return <Navigate to="/onboarding" replace />;
    }

    // 3. Logged In AND Profile Completed -> /home
    return <Navigate to="/home" replace />;
};
