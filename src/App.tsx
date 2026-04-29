import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { auth } from './services/firebase';
import Home from './components/Home';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { UserRole } from './types';

const PrivateRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: UserRole }) => {
  const { user, profile, loading, isSuperAdmin } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Secure Tunnel...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (profile?.active === 'suspended' || profile?.active === 'inactive') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <div className="text-red-500 font-bold uppercase tracking-[0.2em] mb-4">Agency Access Restricted</div>
        <p className="text-zinc-500 text-sm max-w-md">Your account status is currently set to "{profile?.active}". Please contact NextGen Build Labs administration for reactivation.</p>
        <button onClick={() => auth.signOut()} className="mt-8 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Terminate Session</button>
      </div>
    );
  }
  
  if (requiredRole && profile?.role !== requiredRole && !isSuperAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/*" element={
              <PrivateRoute requiredRole={UserRole.SUPERADMIN}>
                <AdminPanel />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
