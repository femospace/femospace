import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageSelector } from './components/LanguageSelector';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { UserList } from './pages/UserList';
import { Analytics } from './pages/Analytics';
import { Marketplace } from './pages/Marketplace';
import { Payments } from './pages/Payments';
import { CreatorEconomy } from './pages/CreatorEconomy';
import { AITools } from './pages/AITools';
import { Reports } from './pages/Reports';
import { Security } from './pages/SecurityCenter';
import { SettingsPage } from './pages/SettingsPage';
import { KYCModeration } from './pages/KYCModeration';
import { VerificationHub } from './pages/VerificationHub';
import { AdModeration } from './pages/AdModeration';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLogin } from './pages/Login';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { EmployeePerformance } from './pages/Performance';
import { ComplaintsEscalation } from './pages/Complaints';
import { ShieldAlert } from 'lucide-react';

function App() {
  const [showLangSelector, setShowLangSelector] = useState(false);

  useEffect(() => {
    const handleOpen = () => setShowLangSelector(true);
    document.addEventListener('open-language-selector', handleOpen);
    return () => document.removeEventListener('open-language-selector', handleOpen);
  }, []);

  return (
    <AdminAuthProvider>
      {showLangSelector && (
        <LanguageSelector onClose={() => setShowLangSelector(false)} />
      )}
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="staff" element={<EmployeeManagement />} />
              <Route path="users" element={<UserList />} />
              <Route path="kyc" element={<KYCModeration />} />
              <Route path="verifications" element={<VerificationHub />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="payments" element={<Payments />} />
              <Route path="creators" element={<CreatorEconomy />} />
              <Route path="ai-tools" element={<AITools />} />
              <Route path="ads" element={<AdModeration />} />
              <Route path="complaints" element={<ComplaintsEscalation />} />
              <Route path="performance" element={<EmployeePerformance />} />
              <Route path="moderation" element={<Reports />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="security" element={<Security />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center py-40 animate-fade-in text-center">
                  <div className="w-24 h-24 bg-red-400/10 rounded-[2rem] flex items-center justify-center text-red-500 mb-8 border border-red-400/20 shadow-xl shadow-red-400/10">
                    <ShieldAlert size={48} />
                  </div>
                  <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Error 404</h1>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Node not found in Admin Core</p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="mt-10 px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/10"
                  >
                    Return to Command Center
                  </button>
                </div>
              } />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
