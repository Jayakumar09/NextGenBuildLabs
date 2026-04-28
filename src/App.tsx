import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { UserRole } from './types';

const PrivateRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: UserRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-400">Loading Agency Portal...</div>;
  if (!user) return <Navigate to="/login" />;
  if (profile?.suspended) return <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-red-500 font-bold uppercase tracking-widest">Access Suspended - Contact NextGen Build Labs</div>;
  
  if (requiredRole && profile?.role !== requiredRole && profile?.role !== UserRole.SUPER_ADMIN) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute requiredRole={UserRole.SUPER_ADMIN}>
                <AdminPanel />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
