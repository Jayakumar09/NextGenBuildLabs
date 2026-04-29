import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit,
  addDoc,
  getDocs
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { Project, UserRole, Invoice, Lead, Ticket, UserProfile, ClientData } from '../types';
import { 
  LogOut, 
  LayoutDashboard, 
  Box, 
  Shield, 
  Settings, 
  Plus,
  Clock,
  Activity,
  Terminal,
  TrendingUp,
  CircleDollarSign,
  Users,
  Target,
  ArrowRight,
  AlertCircle,
  Crown,
  X,
  Bell,
  Layers,
  Calendar,
  ChevronUp,
  CreditCard,
  User as UserIcon,
  Briefcase
} from 'lucide-react';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { profile, isSuperAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [clientUsers, setClientUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Project Creation Modal State
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    clientId: '',
    budget: 0,
    deadline: '',
    status: 'PENDING' as const,
    progress: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;

    const unsubs = [
      // Projects
      onSnapshot(
        isSuperAdmin 
          ? query(collection(db, 'projects'), orderBy('updatedAt', 'desc')) 
          : query(collection(db, 'projects'), where('clientId', '==', profile.uid), orderBy('updatedAt', 'desc')),
        (snapshot) => setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project))),
        (err) => handleFirestoreError(err, OperationType.LIST, 'projects')
      ),
      
      // Invoices
      onSnapshot(
        isSuperAdmin 
          ? query(collection(db, 'invoices'), orderBy('createdAt', 'desc'))
          : query(collection(db, 'invoices'), where('clientId', '==', profile.uid), orderBy('createdAt', 'desc')),
        (snapshot) => setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice))),
        (err) => handleFirestoreError(err, OperationType.LIST, 'invoices')
      ),

      // Support Tickets
      onSnapshot(
        isSuperAdmin 
          ? query(collection(db, 'tickets'), orderBy('createdAt', 'desc'), limit(5))
          : query(collection(db, 'tickets'), where('clientId', '==', profile.uid), orderBy('createdAt', 'desc'), limit(5)),
        (snapshot) => setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket))),
        (err) => handleFirestoreError(err, OperationType.LIST, 'tickets')
      ),

      // Notifications
      onSnapshot(
        isSuperAdmin
          ? query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(10))
          : query(collection(db, 'notifications'), where('userId', '==', profile.uid), orderBy('createdAt', 'desc'), limit(10)),
        (snapshot) => setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any))),
        (err) => handleFirestoreError(err, OperationType.LIST, 'notifications')
      ),

      // Clients
      onSnapshot(
        query(collection(db, 'clients'), limit(50)),
        (snapshot) => setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClientData))),
        (err) => handleFirestoreError(err, OperationType.LIST, 'clients')
      )
    ];

    if (isSuperAdmin) {
      unsubs.push(
        onSnapshot(
          query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(10)),
          (snapshot) => setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead))),
          (err) => handleFirestoreError(err, OperationType.LIST, 'leads')
        )
      );

      // Fetch client users for project assignment
      getDocs(query(collection(db, 'users'), where('role', '==', UserRole.CLIENT))).then(snapshot => {
        setClientUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
      });
    }

    setLoading(false);
    return () => unsubs.forEach(unsub => unsub());
  }, [profile, isSuperAdmin]);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        manager: "NextGen Build Labs",
        updatedAt: Date.now(),
        createdAt: Date.now()
      });
      setShowModal(false);
      setNewProject({
        title: '',
        description: '',
        clientId: '',
        budget: 0,
        deadline: '',
        status: 'PENDING',
        progress: 0
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'projects');
    }
  };

  // Derived Stats
  const revenueByStatus = (status: string) => invoices.filter(i => i.status === status).reduce((sum, i) => sum + i.amount, 0);
  const totalRevenue = revenueByStatus('PAID');
  const pendingPayments = revenueByStatus('PENDING');
  const activeBuildsCount = projects.filter(p => p.status !== 'COMPLETED').length;
  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;

  // Chart Data Preparation - Weekly/Daily trend based on last 7 paid invoices
  const chartData = invoices
    .filter(i => i.status === 'PAID')
    .sort((a, b) => a.createdAt - b.createdAt) // Chronological order
    .slice(-7)
    .map((i) => {
      return {
        name: new Date(i.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        revenue: i.amount,
        volume: projects.filter(p => p.createdAt <= i.createdAt).length || 1
      };
    });

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-950 text-zinc-100">
        <aside className="w-full lg:w-80 bg-zinc-900 border-r border-zinc-800 p-10 flex flex-col shrink-0 animate-pulse">
           <div className="h-10 w-40 bg-zinc-800 rounded-lg mb-16" />
           <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 bg-zinc-800 rounded-xl" />)}
           </div>
           <div className="mt-auto h-24 bg-zinc-800 rounded-3xl" />
        </aside>
        <main className="flex-grow p-10 lg:p-16 space-y-16 animate-pulse">
           <div className="flex justify-between items-center">
              <div className="space-y-6">
                <div className="h-12 w-80 bg-zinc-900 rounded-xl" />
                <div className="h-6 w-60 bg-zinc-900 rounded-lg" />
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-zinc-900 rounded-[2.5rem]" />)}
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 h-[550px] bg-zinc-900 rounded-[2.5rem]" />
              <div className="h-[550px] bg-zinc-900 rounded-[2.5rem]" />
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full lg:w-[270px] bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3.5 mb-10 overflow-visible">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
                <Box className="w-6 h-6" />
            </div>
            <div className="flex flex-col leading-tight">
                <span className="font-black text-xl tracking-tighter text-white whitespace-nowrap">NextGen Build</span>
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-indigo-500/80">Labs</span>
            </div>
        </div>

        <nav className="space-y-1.5 flex-grow">
            {[
                { label: 'Overview', icon: LayoutDashboard, active: true, path: '/dashboard' },
                { label: 'Cloud Builds', icon: Box, active: false, path: '#' },
                { label: 'Financials', icon: CircleDollarSign, active: false, path: '#' },
                { label: 'Operational Hub', icon: Activity, active: false, path: '#' },
            ].map((item, i) => (
                <motion.button 
                    whileHover={{ x: 6, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    key={i} 
                    onClick={() => item.path !== '#' && navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        item.active 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-500/10' 
                        : 'text-zinc-500 hover:text-zinc-100'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </motion.button>
            ))}
            
            {isSuperAdmin && (
                <motion.button 
                    whileHover={{ x: 6, backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-amber-500 hover:text-amber-400 mt-4 border border-transparent hover:border-amber-500/10 transition-all"
                >
                    <Crown className="w-5 h-5" />
                    Admin
                </motion.button>
            )}
        </nav>

        <div className="mt-8 relative mb-2">
            <AnimatePresence>
                {profileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-2 mb-3 shadow-2xl shadow-black z-50 overflow-hidden"
                    >
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <UserIcon className="w-4 h-4" /> Account
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <CreditCard className="w-4 h-4" /> Billing
                        </button>
                        <div className="h-px bg-zinc-800 my-2 mx-2" />
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-4 h-4" /> Shutdown
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all group ${
                    profileOpen ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                }`}
            >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-xl shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500 shrink-0">
                    {profile?.displayName?.[0] || profile?.email?.[0] || 'U'}
                </div>
                <div className="flex-grow text-left overflow-hidden">
                    <div className="text-sm font-bold truncate text-white tracking-tight">{profile?.displayName?.split(' ')[0] || 'User'}</div>
                    <div className="text-[10px] text-zinc-500 truncate uppercase font-black tracking-[0.2em]">{profile?.role}</div>
                </div>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-[var(--spacing-clamp-md)] lg:p-8 overflow-y-auto w-full max-w-[1750px] mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] italic">Systems Operational</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-black tracking-tighter mb-2 text-white leading-tight">
                    {isSuperAdmin ? 'Global Operations Control' : `Systems Online, ${profile?.displayName?.split(' ')[0] || 'User'}`}
                </h1>
                <p className="text-zinc-500 text-sm lg:text-lg font-medium leading-tight max-w-xl">
                    {isSuperAdmin 
                        ? 'Unified intelligence interface for infrastructure and client logistics.' 
                        : 'Secure multi-tenant portal for build visibility and management.'}
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-4">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Last Update Sync</span>
                    <span className="text-xs font-bold text-white leading-none">0.05s ago</span>
                </div>
                {isSuperAdmin && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 30px rgba(99,102,241,0.3)', '0 0 0px rgba(99,102,241,0)'] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      onClick={() => setShowModal(true)}
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] py-4 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5 shrink-0" /> New Project
                    </motion.button>
                )}
            </div>
        </header>

        {/* Modal - New Project Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-zinc-800 flex items-center justify-between">
                   <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-white uppercase"><Layers className="w-6 h-6 text-indigo-500" /> Initialize New Build</h2>
                   <button onClick={() => setShowModal(false)} className="p-3 hover:bg-zinc-800 rounded-2xl transition-all text-zinc-500 hover:text-white">
                      <X className="w-6 h-6" />
                   </button>
                </div>
                <form onSubmit={handleAddProject} className="p-10 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                         <label className="text-xs font-black uppercase text-zinc-600 tracking-widest pl-1">Build Label</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Cloud Genesis Alpha"
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-base focus:border-indigo-500 outline-none transition-all text-white font-bold"
                           value={newProject.title}
                           onChange={e => setNewProject({...newProject, title: e.target.value})}
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-xs font-black uppercase text-zinc-600 tracking-widest pl-1">Assign Tenant</label>
                         <select 
                           required
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-base focus:border-indigo-500 outline-none transition-all text-white font-bold appearance-none"
                           value={newProject.clientId}
                           onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                         >
                            <option value="">Select Target Client</option>
                            {clientUsers.map(u => (
                              <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
                            ))}
                         </select>
                      </div>
                      <div className="md:col-span-2 space-y-3">
                         <label className="text-xs font-black uppercase text-zinc-600 tracking-widest pl-1">System Objective</label>
                         <textarea 
                           required
                           rows={3}
                           placeholder="Infrastructure deployment parameters and scaling requirements..."
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-base focus:border-indigo-500 outline-none transition-all text-white font-bold"
                           value={newProject.description}
                           onChange={e => setNewProject({...newProject, description: e.target.value})}
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-xs font-black uppercase text-zinc-600 tracking-widest pl-1">Budget Allocation ($)</label>
                         <input 
                           required
                           type="number" 
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-base focus:border-indigo-500 outline-none transition-all text-white font-bold"
                           value={newProject.budget}
                           onChange={e => setNewProject({...newProject, budget: parseInt(e.target.value)})}
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-xs font-black uppercase text-zinc-600 tracking-widest pl-1">Deadline SLA</label>
                         <input 
                           required
                           type="date" 
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-base focus:border-indigo-500 outline-none transition-all text-white font-bold"
                           value={newProject.deadline}
                           onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                         />
                      </div>
                   </div>
                   <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-sm tracking-[0.3em] rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all mt-6 active:scale-[0.98]">
                      COMMENCE SYSTEM DEPLOYMENT
                   </button>
                </form>
             </div>
          </div>
        )}

        {/* Status Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[
                { 
                  label: isSuperAdmin ? 'Net Capital' : 'Investment Value', 
                  value: `$${totalRevenue.toLocaleString()}`, 
                  icon: CircleDollarSign, 
                  color: 'text-indigo-400',
                  sub: 'Verified Assets',
                  trend: '+12.4%'
                },
                { 
                  label: isSuperAdmin ? 'Portfolio Strength' : 'Infrastructure Nodes', 
                  value: isSuperAdmin ? clients.length : activeBuildsCount, 
                  icon: isSuperAdmin ? Briefcase : Box, 
                  color: 'text-emerald-400',
                  sub: isSuperAdmin ? 'Active Entities' : `${projects.length} Nodes`,
                  trend: 'Optimal'
                },
                { 
                  label: isSuperAdmin ? 'Pipeline Growth' : 'Settlement Queue', 
                  value: isSuperAdmin ? newLeadsCount : `$${pendingPayments.toLocaleString()}`, 
                  icon: isSuperAdmin ? Target : Shield, 
                  color: isSuperAdmin ? 'text-amber-400' : 'text-red-400',
                  sub: isSuperAdmin ? 'Active Growth' : 'Pending Clearance',
                  trend: '-2.1%'
                },
                { 
                  label: 'System Latency', 
                  value: '0.04ms', 
                  icon: Terminal, 
                  color: 'text-sky-400',
                  sub: 'Peak Performance',
                  trend: 'Stable'
                },
            ].map((stat, i) => (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6, backgroundColor: 'rgba(24, 24, 27, 0.8)' }}
                    key={i} 
                    className="p-8 rounded-[2.5rem] bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/30 transition-all flex flex-col shadow-2xl shadow-black group overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <stat.icon className="w-20 h-20" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className={`p-3 rounded-2xl bg-zinc-950 border border-white/5 ${stat.color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] leading-none mb-1">{stat.label}</div>
                            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{stat.sub}</div>
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 overflow-hidden relative z-10">
                      <div className="text-4xl font-black text-white tracking-tighter truncate">{stat.value}</div>
                      <div className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg bg-white/5 ${stat.trend.startsWith('+') ? 'text-emerald-400' : stat.trend === 'Optimal' || stat.trend === 'Stable' ? 'text-indigo-400' : 'text-zinc-500'}`}>
                        {stat.trend}
                      </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
            {/* Revenue Trend - Left 2 columns */}
            <div className="xl:col-span-2 space-y-8">
                <motion.section 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                        <TrendingUp className="w-80 h-80 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-white uppercase tracking-widest leading-none">Revenue Intelligence</h2>
                            <p className="text-zinc-500 text-base mt-2 font-medium leading-none">Real-time financial telemetry from active builds and cycles.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-6 mr-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Revenue</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Build Vol.</span>
                                </div>
                            </div>
                            <button className="text-[10px] font-black text-indigo-400 hover:text-white transition-all uppercase tracking-[0.2em] border border-zinc-800 hover:border-indigo-500/40 px-5 py-2.5 rounded-xl bg-zinc-950">Scale: 7D</button>
                        </div>
                    </div>
                    <div className={`w-full relative transition-all duration-500 ${chartData.length === 0 ? 'h-[150px]' : 'h-[300px] lg:h-[350px]'}`}>
                        {chartData.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/20 rounded-[2rem] border-2 border-zinc-800 border-dashed">
                                <Activity className="w-10 h-10 mb-4 text-indigo-500/20" />
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-600">Telemetry Isolation Standby</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke="#52525b" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        yId="left"
                                        stroke="#52525b" 
                                        fontSize={12} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(value) => `$${value}`}
                                        tick={{ fontWeight: 700 }}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#18181b', 
                                            border: '1px solid #3f3f46', 
                                            borderRadius: '24px',
                                            padding: '16px 20px',
                                            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
                                        }}
                                        itemStyle={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                        labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}
                                    />
                                    <Area 
                                        yId="left"
                                        type="monotone" 
                                        dataKey="revenue" 
                                        name="Volume Status"
                                        stroke="#6366f1" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorRev)"
                                        isAnimationActive={true}
                                        animationDuration={2000}
                                    />
                                    <Area 
                                        yId="right"
                                        type="stepAfter" 
                                        dataKey="volume" 
                                        name="Build Points"
                                        stroke="#10b981" 
                                        strokeWidth={2}
                                        strokeDasharray="8 8"
                                        fillOpacity={1} 
                                        fill="url(#colorVol)" 
                                        isAnimationActive={true}
                                        animationDuration={3000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.section>

                {/* Active Build Status Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.section 
                        whileHover={{ y: -4 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <Box className="w-5 h-5 text-indigo-500" /> Active Deployments
                            </h3>
                            <span className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/20">{projects.length}</span>
                        </div>
                        <div className="space-y-4">
                            {projects.slice(0, 3).map((p, i) => (
                                <div key={p.id} className="flex items-center justify-between gap-4 p-4 bg-zinc-950/40 border border-zinc-800 rounded-2xl hover:border-indigo-500/30 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-[3px] h-8 bg-indigo-500/40 rounded-full group-hover:bg-indigo-500 transition-colors" />
                                        <div>
                                            <div className="text-xs font-black text-white uppercase tracking-tight mb-0.5">{p.title}</div>
                                            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{p.status}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-indigo-400 mb-1">{p.progress}%</div>
                                        <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${p.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && <p className="text-center py-4 text-zinc-600 text-xs font-bold uppercase tracking-widest italic">No active deployments found.</p>}
                        </div>
                    </motion.section>

                    <motion.section 
                        whileHover={{ y: -4 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-500" /> System Metrics
                            </h3>
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Optimal</span>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'CPU Utilization', value: '14.2%', progress: 14, color: 'bg-emerald-500' },
                                { label: 'Memory Buffer', value: '2.8 GB', progress: 42, color: 'bg-indigo-500' },
                                { label: 'Inbound Traffic', value: '412 Req/s', progress: 68, color: 'bg-sky-500' },
                            ].map((m, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.label}</span>
                                        <span className="text-xs font-black text-white">{m.value}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${m.progress}%` }}
                                            className={`h-full ${m.color}`} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-8">
                {/* Communication Terminal */}
                <motion.section 
                    whileHover={{ y: -4 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
                    <h3 className="text-[10px] font-black mb-8 flex items-center justify-between text-white uppercase tracking-[0.3em] relative z-10">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-indigo-400" /> Interaction Log
                        </div>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="text-indigo-500 font-bold text-[8px]">LIVE_FEED</motion.div>
                    </h3>
                    
                    <div className="space-y-6 relative z-10">
                        {notifications.length > 0 ? notifications.slice(0, 4).map((n, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="mt-1 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700 shrink-0 group-hover:bg-indigo-500 transition-colors" />
                                <div>
                                    <div className="text-[10px] font-black text-white uppercase tracking-tight mb-1 group-hover:text-indigo-300 transition-colors">{n.title}</div>
                                    <p className="text-[10px] text-zinc-600 font-medium leading-relaxed italic line-clamp-2">{n.message}</p>
                                    <div className="text-[8px] text-zinc-700 mt-2 font-black uppercase tracking-widest">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-20">
                                <Activity className="w-10 h-10 mx-auto mb-4 text-zinc-600" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">No cycles recorded</p>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Secure Vault / Financials */}
                <motion.section 
                    whileHover={{ y: -4 }}
                    className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                            <Shield className="w-4 h-4 text-emerald-500" /> Asset Control
                        </h3>
                        <Settings className="w-4 h-4 text-zinc-800 group-hover:text-zinc-600 transition-colors" />
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/20 transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Status</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">SECURED</span>
                            </div>
                            <div className="text-2xl font-black text-white tracking-widest text-center py-2 border-y border-zinc-800/50 mb-3 bg-zinc-950/20">
                                DASH_V2.0
                            </div>
                            <p className="text-[8px] text-zinc-600 uppercase tracking-widest font-black leading-relaxed text-center">
                                Advanced multi-layered encryption protocol active for all client assets.
                            </p>
                        </div>
                        
                        <button className="w-full py-4 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40 text-[10px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.3em] rounded-xl flex items-center justify-center gap-2">
                             Access Invoices <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </motion.section>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
