import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { UserList } from './pages/UserList';
import { Analytics } from './pages/Analytics';
import { ContentManagement } from './pages/ContentManagement';
import { Monetization } from './pages/Monetization';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="monetization" element={<Monetization />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-40 animate-fade-in text-center">
              <div className="w-24 h-24 bg-red-400/10 rounded-[2rem] flex items-center justify-center text-red-500 mb-8 border border-red-400/20 shadow-xl shadow-red-400/10">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight">404: Zone Not Found</h1>
              <p className="text-slate-400 max-w-sm font-medium">This administrative sector does not currently exist or your access clearance is insufficient.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="mt-10 px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-slate-200 transition-all shadow-xl shadow-white/10"
              >
                Return to Command Center
              </button>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
