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
import { Project, UserRole, Invoice, Lead, Ticket, UserProfile } from '../types';
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
  User as UserIcon
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
        <aside className="w-full lg:w-72 bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col shrink-0 animate-pulse">
           <div className="h-8 w-32 bg-zinc-800 rounded-lg mb-12" />
           <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-zinc-800 rounded-xl" />)}
           </div>
           <div className="mt-auto h-20 bg-zinc-800 rounded-2xl" />
        </aside>
        <main className="flex-grow p-8 lg:p-12 space-y-12 animate-pulse">
           <div className="flex justify-between items-center">
              <div className="space-y-4">
                <div className="h-10 w-64 bg-zinc-900 rounded-xl" />
                <div className="h-4 w-48 bg-zinc-900 rounded-lg" />
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-3xl" />)}
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-[450px] bg-zinc-900 rounded-3xl" />
              <div className="h-[450px] bg-zinc-900 rounded-3xl" />
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Box className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-white">NextGen Portal</span>
        </div>

        <nav className="space-y-2 flex-grow">
            {[
                { label: 'Overview', icon: LayoutDashboard, active: true, path: '/dashboard' },
                { label: 'Cloud Builds', icon: Box, active: false, path: '#' },
                { label: 'Financials', icon: CircleDollarSign, active: false, path: '#' },
                { label: 'Operational Hub', icon: Activity, active: false, path: '#' },
            ].map((item, i) => (
                <motion.button 
                    whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    key={i} 
                    onClick={() => item.path !== '#' && navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                        item.active 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                        : 'text-zinc-500 hover:text-zinc-100'
                    }`}
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </motion.button>
            ))}
            
            {isSuperAdmin && (
                <motion.button 
                    whileHover={{ x: 5, backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-amber-500 hover:text-amber-400 mt-4 border border-transparent hover:border-amber-500/10 transition-all"
                >
                    <Crown className="w-5 h-5" />
                    Admin Panel
                </motion.button>
            )}
        </nav>

        <div className="mt-auto relative">
            <AnimatePresence>
                {profileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-2 mb-2 shadow-2xl shadow-black z-50 overflow-hidden"
                    >
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <UserIcon className="w-4 h-4" /> Account Settings
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <CreditCard className="w-4 h-4" /> Billing Config
                        </button>
                        <div className="h-px bg-zinc-800 my-2 mx-2" />
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-4 h-4" /> Terminate Node
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group ${
                    profileOpen ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                }`}
            >
                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500 shrink-0">
                    {profile?.displayName?.[0] || profile?.email?.[0] || 'U'}
                </div>
                <div className="flex-grow text-left overflow-hidden">
                    <div className="text-sm font-bold truncate text-white tracking-tight">{profile?.displayName || 'Agency User'}</div>
                    <div className="text-[10px] text-zinc-500 truncate uppercase font-black tracking-[0.2em]">{profile?.role}</div>
                </div>
                <ChevronUp className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">
                    {isSuperAdmin ? 'Global Operations' : `Welcome, ${profile?.displayName?.split(' ')[0] || 'Client'}`}
                </h1>
                <p className="text-zinc-500 text-sm">
                    {isSuperAdmin 
                        ? 'Unified control interface for NextGen Build Labs.' 
                        : 'Secure client portal • Professional development console.'}
                </p>
            </div>
            {isSuperAdmin && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-4 h-4" /> New Project
                </button>
            )}
        </header>

        {/* Modal - New Project Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                   <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Layers className="w-5 h-5 text-indigo-500" /> Initialize New Project</h2>
                   <button onClick={() => setShowModal(false)} className="p-2 hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-white">
                      <X className="w-5 h-5" />
                   </button>
                </div>
                <form onSubmit={handleAddProject} className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Project Title</label>
                         <input 
                           required
                           type="text" 
                           placeholder="Cloud Infrastructure Setup"
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                           value={newProject.title}
                           onChange={e => setNewProject({...newProject, title: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Assign Client</label>
                         <select 
                           required
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                           value={newProject.clientId}
                           onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                         >
                            <option value="">Select Target Client</option>
                            {clientUsers.map(u => (
                              <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
                            ))}
                         </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Objective Summary</label>
                         <textarea 
                           required
                           rows={3}
                           placeholder="Deployment goals and infrastructure scope..."
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                           value={newProject.description}
                           onChange={e => setNewProject({...newProject, description: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Target Budget ($)</label>
                         <input 
                           required
                           type="number" 
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                           value={newProject.budget}
                           onChange={e => setNewProject({...newProject, budget: parseInt(e.target.value)})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Deadline SLA</label>
                         <input 
                           required
                           type="date" 
                           className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                           value={newProject.deadline}
                           onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                         />
                      </div>
                   </div>
                   <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-500/20 transition-all mt-4">
                      Deploy Project Infrastructure
                   </button>
                </form>
             </div>
          </div>
        )}

        {/* Status Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {[
                { 
                  label: isSuperAdmin ? 'Total Paid Revenue' : 'Investment Total', 
                  value: `$${totalRevenue.toLocaleString()}`, 
                  icon: CircleDollarSign, 
                  color: 'text-indigo-400',
                  sub: 'Capital Verified'
                },
                { 
                  label: 'Active Deployments', 
                  value: activeBuildsCount, 
                  icon: Box, 
                  color: 'text-emerald-400',
                  sub: `${projects.length} Cumulative Builds`
                },
                { 
                  label: isSuperAdmin ? 'New Lead Intake' : 'Pending Transfers', 
                  value: isSuperAdmin ? newLeadsCount : `$${pendingPayments.toLocaleString()}`, 
                  icon: isSuperAdmin ? Target : Shield, 
                  color: isSuperAdmin ? 'text-amber-400' : 'text-red-400',
                  sub: isSuperAdmin ? 'Pipeline Opportunity' : 'Outstanding Balances'
                },
                { 
                  label: 'System Uptime', 
                  value: '99.99%', 
                  icon: Activity, 
                  color: 'text-sky-400',
                  sub: 'Operational Priority'
                },
            ].map((stat, i) => (
                <div key={i} className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all flex flex-col shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-2.5 rounded-xl bg-zinc-800/50 border border-white/5 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</div>
                      <div className="text-[10px] text-zinc-600 font-bold mt-2 uppercase tracking-tight">{stat.sub}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
            {/* Revenue Trend - Left 2 columns */}
            <div className="xl:col-span-2 space-y-8">
                <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-white uppercase tracking-widest">Revenue Pulse</h2>
                            <p className="text-zinc-500 text-sm mt-1 font-medium italic">Synchronized inbound capital trend from last 7 paid cycles.</p>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                            <TrendingUp className="w-4 h-4" /> +12.4% Intensity
                        </div>
                    </div>
                    <div className="h-[300px] w-full relative">
                        {chartData.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                                <Activity className="w-12 h-12 mb-4 opacity-10" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Pulse Detected • Awaiting Initial Transaction</p>
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
                </section>

                {/* Active Projects List */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-white uppercase tracking-widest leading-none">Active Builds</h2>
                            <p className="text-zinc-600 text-xs mt-2 font-bold tracking-widest uppercase">Infrastructure Deployment</p>
                        </div>
                        <button className="text-xs font-black text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] bg-indigo-500/5 px-4 py-2 rounded-lg border border-indigo-500/10 hover:border-indigo-500/30">View Registry</button>
                    </div>
                    <div className="space-y-4">
                        {projects.length === 0 ? (
                            <div className="py-20 text-center bg-zinc-950/30 rounded-3xl border-2 border-dashed border-zinc-800/50 group hover:border-indigo-500/30 transition-all">
                                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-700 group-hover:text-indigo-500 transition-colors">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <h4 className="text-white font-bold mb-2 uppercase tracking-widest">No Active Nodes</h4>
                                <p className="text-zinc-500 text-xs mb-8 max-w-xs mx-auto">Initialize your first cloud build to begin infrastructure deployment.</p>
                                <button 
                                    onClick={() => navigate(isSuperAdmin ? '/admin' : '#')}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    {isSuperAdmin ? 'Initialize First Build' : 'Request New Deployment'}
                                </button>
                            </div>
                        ) : (
                            projects
                                .filter(p => p.status !== 'COMPLETED')
                                .slice(0, 4)
                                .map((p, pIdx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: pIdx * 0.1 }}
                                    key={p.id} 
                                    className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl group hover:border-indigo-500/40 hover:bg-zinc-950 transition-all flex flex-col md:flex-row md:items-center justify-between shadow-lg shadow-black/20 gap-4"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 group-hover:rotate-12 transition-transform duration-500">
                                            <Terminal className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight leading-none mb-1.5">{p.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">${p.budget.toLocaleString()}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                                    {isSuperAdmin 
                                                        ? clientUsers.find(u => u.uid === p.clientId)?.displayName || 'Unknown Client'
                                                        : `Due: ${p.deadline}`}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    p.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500 animate-pulse'
                                                }`}>{p.status.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-8 flex-grow">
                                        <div className="w-full md:w-40">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Build Integrity</span>
                                                <span className="text-[10px] font-black text-white">{p.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${p.progress}%` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]" 
                                                />
                                            </div>
                                        </div>
                                        <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Sidebar Stats & Recent Activity */}
            <div className="space-y-8">
                {/* Pending Invoices */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                    <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-white">
                        <CircleDollarSign className="w-4 h-4 text-amber-500" /> Pending Transfers
                    </h3>
                    <div className="space-y-4">
                        {invoices.filter(i => i.status === 'PENDING').length === 0 ? (
                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-green-500 text-[10px] font-bold text-center uppercase tracking-widest">
                                CLEAR_BALANCE
                            </div>
                        ) : (
                            invoices.filter(i => i.status === 'PENDING').slice(0, 3).map(inv => (
                                <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                                    <div>
                                        <div className="text-xs font-bold text-white">${inv.amount.toLocaleString()}</div>
                                        <div className="text-[9px] text-zinc-600 font-medium uppercase truncate w-24">#{inv.id.slice(0, 8)}</div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">AWAITING</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Activity Feed */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-sm font-black mb-8 flex items-center gap-2 text-white uppercase tracking-widest">
                        <Activity className="w-5 h-5 text-indigo-400" /> Neural Activity Feed
                    </h3>
                    <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800 text-left">
                        {/* Priority Notifications */}
                        {notifications.slice(0, 5).map((notif, i) => (
                            <div key={`notif-${i}`} className="relative pl-8 group">
                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-lg flex items-center justify-center z-10 border transition-all cursor-default ${
                                    notif.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-indigo-500/10 border-indigo-500/20'
                                }`}>
                                    <Bell className={`w-3 h-3 ${notif.type === 'error' ? 'text-red-400' : 'text-indigo-400'}`} />
                                </div>
                                <div className="cursor-default">
                                    <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{notif.title}</div>
                                    <div className="text-xs text-zinc-500 font-medium leading-tight mt-1 mb-2 italic line-clamp-2">{notif.message}</div>
                                    <div className="text-[10px] text-zinc-700 font-black uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* CRM Leads (Admin Only) */}
                        {isSuperAdmin && leads.slice(0, 3).map((lead, i) => (
                            <div key={`lead-${i}`} className="relative pl-8 group">
                                <div className="absolute left-0 top-1 w-6 h-6 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center z-10 group-hover:border-indigo-500/50 transition-all cursor-default">
                                    <Users className="w-3 h-3 text-zinc-500 group-hover:text-indigo-400" />
                                </div>
                                <div className="cursor-default">
                                    <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight">New Intake: {lead.name}</div>
                                    <div className="text-xs text-zinc-600 font-medium leading-none mt-1.5 uppercase tracking-wide">Client Pipeline • {lead.source}</div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Support Tickets */}
                        {tickets.slice(0, 3).map((ticket, i) => (
                            <div key={`ticket-${i}`} className="relative pl-8 group">
                                <div className="absolute left-0 top-1 w-6 h-6 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center z-10 group-hover:border-emerald-500/50 transition-all cursor-default">
                                    <AlertCircle className="w-3 h-3 text-emerald-500" />
                                </div>
                                <div className="cursor-default">
                                    <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate max-w-[150px]">{ticket.subject}</div>
                                    <div className="text-xs text-zinc-600 font-medium leading-none mt-1.5 uppercase tracking-wide">Support Cycle • {ticket.status}</div>
                                </div>
                            </div>
                        ))}

                        {notifications.length === 0 && leads.length === 0 && tickets.length === 0 && (
                            <div className="py-12 text-center">
                                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-800">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <p className="text-zinc-700 text-xs font-black uppercase tracking-[0.25em]">No Pulse Detected</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
