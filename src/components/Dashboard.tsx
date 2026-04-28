import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Project, UserRole } from '../types';
import { 
  LogOut, 
  LayoutDashboard, 
  Box, 
  Shield, 
  Settings, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Terminal
} from 'lucide-react';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { profile, isSuperAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;

    // Fetch projects based on role
    const projectsRef = collection(db, 'projects');
    const q = isSuperAdmin 
      ? query(projectsRef) 
      : query(projectsRef, where('clientId', '==', profile.clientId || profile.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projs);
    });

    return () => unsubscribe();
  }, [profile, isSuperAdmin]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-zinc-900/50 border-r border-zinc-800 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Box className="text-white w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">Portal Console</span>
        </div>

        <nav className="space-y-2 flex-grow">
            {[
                { label: 'Overview', icon: LayoutDashboard, active: true },
                { label: 'Projects', icon: Box, active: false },
                { label: 'Security', icon: Shield, active: false },
                { label: 'Settings', icon: Settings, active: false },
            ].map((item, i) => (
                <button 
                    key={i} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        item.active 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                </button>
            ))}
        </nav>

        {isSuperAdmin && (
            <div className="mt-auto mb-8 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                <div className="text-[10px] uppercase tracking-widest font-black text-indigo-500 mb-2">Agency Admin</div>
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full text-left text-xs font-bold text-indigo-300 hover:text-indigo-200"
                >
                    Management Panel →
                </button>
            </div>
        )}

        <div className="flex items-center gap-4 mt-4 pt-8 border-t border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">
                {profile?.displayName?.[0] || profile?.email?.[0] || 'U'}
            </div>
            <div className="flex-grow overflow-hidden">
                <div className="text-sm font-bold truncate">{profile?.displayName || 'Client User'}</div>
                <div className="text-xs text-zinc-600 truncate">{profile?.role}</div>
            </div>
            <button 
                onClick={handleLogout}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Welcome back, <span className="text-indigo-500">{profile?.displayName?.split(' ')[0] || 'Client'}</span>
                </h1>
                <p className="text-zinc-500 text-sm">
                    Managed by <span className="text-zinc-300 font-medium">NextGen Build Labs</span> • All systems nominal.
                </p>
            </div>
            {isSuperAdmin && (
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" /> New Project
                </button>
            )}
        </header>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {[
                { label: 'Active Projects', value: projects.length, icon: Box, color: 'text-indigo-500' },
                { label: 'Managed Health', value: '100%', icon: Activity, color: 'text-green-500' },
                { label: 'Backup Status', value: 'Daily', icon: Shield, color: 'text-indigo-500' },
                { label: 'Security Level', value: 'Enterprise', icon: AlertCircle, color: 'text-indigo-500' },
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg bg-zinc-800 ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white leading-none mb-1">{stat.value}</div>
                    <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>

        {/* Projects List */}
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight">Active Builds</h2>
                <div className="text-zinc-500 text-xs font-medium">Updated 5m ago</div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {projects.length === 0 ? (
                    <div className="p-20 rounded-3xl bg-zinc-900 border border-zinc-800 border-dashed flex flex-col items-center text-center">
                        <Box className="w-12 h-12 text-zinc-800 mb-4" />
                        <h3 className="text-zinc-400 font-bold">No active projects</h3>
                        <p className="text-zinc-600 text-sm max-w-xs mt-2">
                             Consult NextGen Build Labs to start a new managed development project.
                        </p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-indigo-400">
                                    <Terminal className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                            <Clock className="w-3 h-3" /> Updated {new Date(project.updatedAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs text-zinc-500 capitalize">
                                            <div className="w-2 h-2 rounded-full bg-green-500" /> {project.status.toLowerCase().replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow max-w-sm md:mx-12">
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-zinc-500 font-medium">Build Progress</span>
                                    <span className="text-white font-bold">{project.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>

                            <button className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-all border border-zinc-700/50">
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>

        {/* Managed Service Card */}
        <section className="mt-12 p-8 rounded-3xl bg-indigo-600 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full aspect-square bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Operational Excellence</h2>
                    <p className="text-indigo-100/80 text-sm max-w-lg leading-relaxed">
                        Your application is hosted on high-performance infrastructure managed by NextGen Build Labs. 
                        Includes enterprise-grade uptime SLAs and professional support.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                                {i}
                            </div>
                        ))}
                    </div>
                    <span className="text-white text-xs font-bold uppercase tracking-tight">Active Team</span>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
