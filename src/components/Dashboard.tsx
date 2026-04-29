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
      <main className="flex-grow p-[var(--spacing-clamp-md)] lg:p-8 overflow-y-auto w-full max-w-[1650px] mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="max-w-3xl">
                <h1 className="text-3xl lg:text-4xl font-black tracking-tighter mb-1.5 text-white leading-tight">
                    {isSuperAdmin ? 'Global Operations Control' : `Systems Online, ${profile?.displayName?.split(' ')[0] || 'User'}`}
                </h1>
                <p className="text-zinc-500 text-sm lg:text-base font-medium leading-tight">
                    {isSuperAdmin 
                        ? 'Unified intelligence interface for infrastructure and client logistics.' 
                        : 'Secure multi-tenant portal for build visibility and management.'}
                </p>
            </div>
            {isSuperAdmin && (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] py-3.5 px-6 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 whitespace-nowrap min-w-[180px]"
                >
                    <Plus className="w-5 h-5 shrink-0" /> New Project
                </motion.button>
            )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {[
                { 
                  label: isSuperAdmin ? 'Capital' : 'Investment', 
                  value: `$${totalRevenue.toLocaleString()}`, 
                  icon: CircleDollarSign, 
                  color: 'text-indigo-400',
                  sub: 'Verified Assets'
                },
                { 
                  label: isSuperAdmin ? 'Portfolio' : 'Infrastructure', 
                  value: isSuperAdmin ? clients.length : activeBuildsCount, 
                  icon: isSuperAdmin ? Briefcase : Box, 
                  color: 'text-emerald-400',
                  sub: isSuperAdmin ? 'Active Entities' : `${projects.length} Nodes`
                },
                { 
                  label: isSuperAdmin ? 'Leads' : 'Payments', 
                  value: isSuperAdmin ? newLeadsCount : `$${pendingPayments.toLocaleString()}`, 
                  icon: isSuperAdmin ? Target : Shield, 
                  color: isSuperAdmin ? 'text-amber-400' : 'text-red-400',
                  sub: isSuperAdmin ? 'Active Growth' : 'Settlement'
                },
                { 
                  label: 'Latency', 
                  value: '0.04ms', 
                  icon: Activity, 
                  color: 'text-sky-400',
                  sub: 'Peak'
                },
            ].map((stat, i) => (
                <motion.div 
                    whileHover={{ y: -4 }}
                    key={i} 
                    className="p-6 rounded-[2rem] bg-zinc-900 border border-zinc-800/80 hover:border-indigo-500/20 hover:bg-zinc-900 transition-all flex flex-col shadow-xl shadow-black/40 group overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`p-2.5 rounded-xl bg-zinc-950 border border-white/5 ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{stat.label}</div>
                    </div>
                    <div className="flex items-baseline justify-between gap-2 overflow-hidden">
                      <div className="text-3xl font-black text-white tracking-tighter truncate">{stat.value}</div>
                      <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest shrink-0">{stat.sub}</div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-left">
            {/* Revenue Trend - Left 2 columns */}
            <div className="xl:col-span-2 space-y-6">
                <motion.section 
                    whileHover={{ y: -4, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.4)' }}
                    className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 lg:p-8 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black tracking-tighter text-white uppercase tracking-widest leading-none">Revenue Pulse</h2>
                            <p className="text-zinc-500 text-sm mt-1.5 font-medium leading-none">Real-time financial telemetry from transaction cycles.</p>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-tighter">
                            <TrendingUp className="w-4 h-4" /> Momentum
                        </div>
                    </div>
                    <div className={`w-full relative transition-all duration-500 ${chartData.length === 0 ? 'h-[100px]' : 'h-[210px] lg:h-[260px]'}`}>
                        {chartData.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/20 rounded-2xl border border-zinc-800/50 border-dashed">
                                <Activity className="w-6 h-6 mb-2 text-indigo-500/30" />
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">Telemetry Standby</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
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
                                        fontSize={11} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fontWeight: 600 }}
                                    />
                                    <YAxis 
                                        yId="left"
                                        stroke="#52525b" 
                                        fontSize={11} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickFormatter={(value) => `$${value}`}
                                        tick={{ fontWeight: 600 }}
                                    />
                                    <YAxis 
                                        yId="right"
                                        orientation="right"
                                        stroke="#52525b" 
                                        fontSize={11} 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tick={{ fontWeight: 600 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#18181b', 
                                            border: '1px solid #3f3f46', 
                                            borderRadius: '16px',
                                            padding: '12px 16px',
                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                        }}
                                        itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                    />
                                    <Area 
                                        yId="left"
                                        type="monotone" 
                                        dataKey="revenue" 
                                        name="Revenue"
                                        stroke="#6366f1" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRev)"
                                        isAnimationActive={true}
                                    />
                                    <Area 
                                        yId="right"
                                        type="monotone" 
                                        dataKey="volume" 
                                        name="Project Volume"
                                        stroke="#10b981" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        fillOpacity={1} 
                                        fill="url(#colorVol)" 
                                        isAnimationActive={true}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.section>

                {/* Active Projects List */}
                <motion.section 
                    whileHover={{ y: -4, boxShadow: '0 20px 40px -20px rgba(99,102,241,0.15)' }}
                    className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black tracking-tighter text-white uppercase tracking-widest leading-none">Active Builds</h2>
                            <p className="text-zinc-600 text-[10px] mt-2 font-bold tracking-widest uppercase leading-none">Infrastructure Status</p>
                        </div>
                        <button className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] bg-indigo-500/5 px-4 py-2 rounded-lg border border-indigo-500/10 hover:border-indigo-500/30">Registry</button>
                    </div>
                    <div className="space-y-4">
                        {projects.length === 0 ? (
                            <div className="py-6 text-center bg-zinc-950/40 rounded-[2rem] border-2 border-dashed border-zinc-800 group hover:border-indigo-500/30 transition-all min-h-[70px] flex flex-col items-center justify-center">
                                <h4 className="text-[11px] text-zinc-300 font-extrabold mb-1 uppercase tracking-[0.2em]">Infrastructure Idle</h4>
                                <button 
                                    onClick={() => navigate(isSuperAdmin ? '/admin' : '#')}
                                    className="text-[9px] text-indigo-400/80 font-black uppercase tracking-widest hover:text-indigo-300 transition-colors"
                                >
                                    {isSuperAdmin ? 'Deploy Node' : 'Request Connection'} →
                                </button>
                            </div>
                        ) : (
                            projects
                                .filter(p => p.status !== 'COMPLETED')
                                .slice(0, 4)
                                .map((p, pIdx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: pIdx * 0.1 }}
                                    key={p.id} 
                                    className="p-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl group hover:border-indigo-500/40 hover:bg-zinc-950 transition-all flex flex-col md:flex-row md:items-center justify-between shadow-xl shadow-black/20 gap-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 group-hover:rotate-12 transition-transform duration-500">
                                            <Terminal className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight leading-none mb-1.5">{p.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">${p.budget.toLocaleString()}</span>
                                                <span className="w-1 h-1 rounded-full bg-indigo-500/40 animate-pulse" />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    p.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'
                                                }`}>{p.status.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-6 flex-grow">
                                        <div className="w-full md:w-40">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">SLA Integrity</span>
                                                <span className="text-[9px] font-black text-white">{p.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${p.progress}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full" 
                                                />
                                            </div>
                                        </div>
                                        <button className="p-2 text-zinc-600 hover:text-white transition-all hover:bg-zinc-800 rounded-lg">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                                ))
                        )}
                    </div>
                </motion.section>
            </div>

            {/* Sidebar Stats & Recent Activity */}
            <div className="space-y-6">
                {/* Pending Invoices */}
                <motion.section 
                    whileHover={{ y: -4, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.4)' }}
                    className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-2xl min-h-[120px] flex flex-col"
                >
                    <h3 className="text-[10px] font-black mb-4 flex items-center justify-between text-white uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-3">
                            <CircleDollarSign className="w-4 h-4 text-amber-500" /> Capital Queue
                        </div>
                        <motion.div 
                            animate={{ opacity: [0.4, 1, 0.4] }} 
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                        />
                    </h3>
                    <div className="space-y-3 flex-grow">
                        {invoices.filter(i => i.status === 'PENDING').length === 0 ? (
                            <div className="flex-grow flex items-center justify-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[9px] font-black text-center uppercase tracking-[0.3em]">
                                ASSET_STABLE
                            </div>
                        ) : (
                            invoices.filter(i => i.status === 'PENDING').slice(0, 3).map(inv => (
                                <div key={inv.id} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 group hover:border-amber-500/20 transition-all">
                                    <div>
                                        <div className="text-sm font-black text-white mb-0.5">${inv.amount.toLocaleString()}</div>
                                        <div className="text-[8px] text-zinc-600 font-bold uppercase truncate w-24 tracking-wider">PID_{inv.id.slice(0, 8)}</div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 tracking-widest">QUEUE</span>
                                </div>
                            ))
                        )}
                    </div>
                </motion.section>

                {/* Activity Feed */}
                <motion.section 
                    whileHover={{ y: -4, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.4)' }}
                    className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 shadow-2xl"
                >
                    <h3 className="text-[10px] font-black mb-5 flex items-center justify-between text-white uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-indigo-400" /> Intelligence
                        </div>
                        <motion.div 
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} 
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-2 h-2 rounded-full border border-indigo-500" 
                        />
                    </h3>
                    <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800 text-left">
                        {notifications.slice(0, 5).map((notif, i) => (
                            <div key={`notif-${i}`} className="relative pl-8 group">
                                <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-lg flex items-center justify-center z-10 border transition-all cursor-default ${
                                    notif.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-indigo-500/10 border-indigo-500/20'
                                } shadow-lg shadow-black/20 group-hover:scale-110`}>
                                    <Bell className={`w-3 h-3 ${notif.type === 'error' ? 'text-red-400' : 'text-indigo-400'}`} />
                                </div>
                                <div className="cursor-default">
                                    <div className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight leading-tight mb-1">{notif.title}</div>
                                    <div className="text-[9px] text-zinc-500 font-medium leading-relaxed mb-2 italic line-clamp-1">{notif.message}</div>
                                    <div className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="py-6 text-center">
                                <Activity className="w-5 h-5 text-zinc-800 mx-auto mb-2 opacity-20" />
                                <p className="text-zinc-700 text-[8px] font-black uppercase tracking-[0.25em]">Standby...</p>
                            </div>
                        )}
                    </div>
                </motion.section>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
