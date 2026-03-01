import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { Welcome } from './pages/Welcome';
import { TermsPage, PrivacyPage, HelpCenter } from './pages/legal';
import { Home } from './pages/Home';
import { ProfileSetup } from './pages/onboarding/ProfileSetup';
import { CreatorDashboard } from './pages/creator/CreatorDashboard';
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { MainLayout } from './components/layout/MainLayout';
import { Videos } from './pages/Videos';
import { Chat } from './pages/Chat';
import { Notifications } from './pages/Notifications';
import { Search } from './pages/Search';
import { Menu } from './pages/Menu';
import { Profile } from './pages/Profile';
import { SecurityCenter } from './pages/SecurityCenter';
import { Login } from './auth/pages/Login';
import { ForgotPassword } from './auth/pages/ForgotPassword';
import { EmailVerification } from './auth/pages/EmailVerification';
import { Settings } from './pages/Settings';
import { EditProfile } from './pages/EditProfile';
import { VipBadge } from './pages/VipBadge';
import { CreatorCertification } from './pages/CreatorCertification';
import { AdminCreatorReview } from './pages/AdminCreatorReview';
import { FemoMail } from './pages/FemoMail';
import { MonetizationDashboard } from './pages/MonetizationDashboard';
import { KYCVerification } from './pages/KYCVerification';
import { LiveStudio } from './pages/videos/studio/LiveStudio';
import Register from './auth/pages/Register';
import { AuthLayout } from './components/layout/AuthLayout';
import { isRTL } from './data/languages';
import './i18n';
import { SocketProvider } from './contexts/SocketContext';

const RootRedirect = () => {
  const { isAuthenticated, authReady, user } = useAuth();

  if (!authReady) return null;

  if (isAuthenticated) {
    if (user && !user.isOnboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    const pendingAction = localStorage.getItem('pendingSupportAction');
    if (pendingAction === 'chat') {
      localStorage.removeItem('pendingSupportAction');
      return <Navigate to="/chat?support=true" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/welcome" replace />;
};

function App() {
  const { i18n } = useTranslation();

  // Apply RTL direction when language changes
  useEffect(() => {
    const rtl = isRTL(i18n.language);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Root Redirect - Dynamic logic */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public Routes - Only for non-logged-in users */}
            <Route element={<PublicRoute />}>
              <Route path="/welcome" element={<Welcome />} />
              <Route element={<AuthLayout />}>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/verify-email" element={<EmailVerification />} />
                <Route path="/auth/register/*" element={<Register />} />
              </Route>
            </Route>

            {/* Static Public Pages - For everyone */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/help" element={<HelpCenter />} />

            {/* Private Routes - Only for logged-in users */}
            <Route element={<PrivateRoute />}>
              {/* Onboarding */}
              <Route path="/onboarding" element={<ProfileSetup />} />

              {/* Creator Studio */}
              <Route path="/creator" element={<CreatorDashboard />} />

              {/* Business Suite */}
              <Route path="/business" element={<BusinessDashboard />} />

              {/* Main App with MainLayout */}
              <Route element={<SocketProvider><MainLayout><Outlet /></MainLayout></SocketProvider>}>
                <Route path="/home" element={<Home />} />
                <Route path="/feed" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/videos/live/studio" element={<LiveStudio />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/mail" element={<FemoMail />} />
                <Route path="/monetization" element={<MonetizationDashboard />} />
                <Route path="/monetization/kyc" element={<KYCVerification />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/security" element={<SecurityCenter />} />
                <Route path="/vip-badge" element={<VipBadge />} />
                <Route path="/creator-certification" element={<CreatorCertification />} />
                <Route path="/admin/creator-applications" element={<AdminCreatorReview />} />
              </Route>
            </Route>

            {/* Catch all - redirect to welcome */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


