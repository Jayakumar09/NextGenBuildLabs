import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../services/firebase';
import { UserProfile, Project, UserRole, Lead, ClientData, Invoice, Ticket } from '../types';
import { seedDatabase } from '../services/seedData';
import { 
  ShieldAlert, 
  Users, 
  Lock, 
  Unlock, 
  ArrowLeft,
  Search,
  PlusCircle,
  Briefcase,
  Layers,
  CircleDollarSign,
  Headphones,
  UserPlus,
  Terminal,
  Activity,
  Trash2,
  ExternalLink,
  MessageSquare,
  Bell,
  LayoutDashboard,
  Database,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'leads' | 'clients' | 'projects' | 'payments' | 'support' | 'staff' | 'notifications'>('users');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'>('ALL');
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Data States
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Project Creation State
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    clientId: '',
    budget: 0,
    deadline: '',
    status: 'PENDING' as const,
    progress: 0
  });

  useEffect(() => {
    if (!isSuperAdmin) return;

    const unsubscribers = [
      onSnapshot(collection(db, 'users'), (snapshot) => {
        const allUsers = snapshot.docs.map(doc => doc.data() as UserProfile);
        setUsers(allUsers);
        setStaff(allUsers.filter(u => u.role === UserRole.STAFF || u.role === UserRole.SUPERADMIN));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'users')),
      
      onSnapshot(query(collection(db, 'leads'), orderBy('createdAt', 'desc')), (snapshot) => {
        setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'leads')),
      
      onSnapshot(collection(db, 'projects'), (snapshot) => {
        setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects')),

      onSnapshot(collection(db, 'clients'), (snapshot) => {
        setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ClientData)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'clients')),
      
      onSnapshot(collection(db, 'invoices'), (snapshot) => {
        setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'invoices')),
      
      onSnapshot(collection(db, 'tickets'), (snapshot) => {
        setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'tickets')),

      onSnapshot(query(collection(db, 'notifications'), orderBy('createdAt', 'desc')), (snapshot) => {
        setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'notifications'))
    ];

    setLoading(false);
    return () => unsubscribers.forEach(unsub => unsub());
  }, [isSuperAdmin]);

  // Handlers
  const toggleSuspension = async (uid: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await updateDoc(doc(db, 'users', uid), { active: newStatus });
  };

  const deleteItem = async (col: string, id: string) => {
    if (confirm('Permanently wipe this entry from Agency Records? This action is irreversible.')) {
      await deleteDoc(doc(db, col, id));
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        manager: "NextGen Build Labs",
        updatedAt: Date.now(),
        createdAt: Date.now()
      });
      setShowProjectForm(false);
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

  const handleProjectUpdate = async (id: string, updates: Partial<Project>) => {
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...updates,
        updatedAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'projects');
    }
  };

  const handleSeed = async () => {
    if (confirm('Deploy simulation data to all nodes? This will add sample records for demonstration.')) {
      setIsSeeding(true);
      try {
        await seedDatabase();
        alert('Simulation data successfully injected.');
      } catch (err) {
        console.error(err);
        alert('Seeding failed. See logs.');
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingPayments = invoices.filter(i => i.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

  const filteredProjects = statusFilter === 'ALL' 
    ? projects 
    : projects.filter(p => p.status === statusFilter);

  if (!isSuperAdmin) return null;

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        activeTab === id 
        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
        : 'text-zinc-500 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <div className="font-black text-xs uppercase tracking-[0.2em] text-white">NextGen <span className="text-indigo-500">Labs</span></div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all border border-transparent hover:border-indigo-500/10 mb-4"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </button>

        <nav className="flex flex-col gap-2">
          <NavItem id="users" label="User Directory" icon={Users} />
          <NavItem id="leads" label="CRM Leads" icon={UserPlus} />
          <NavItem id="clients" label="Agency Clients" icon={Briefcase} />
          <NavItem id="projects" label="Project Engine" icon={Layers} />
          <NavItem id="payments" label="Financial Ops" icon={CircleDollarSign} />
          <NavItem id="support" label="Support Desk" icon={Headphones} />
          <NavItem id="staff" label="Team Performance" icon={Activity} />
          <NavItem id="notifications" label="Alert Node" icon={Bell} />
        </nav>

        <div className="mt-4">
            <button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all border border-emerald-500/20 hover:border-emerald-500/40 disabled:opacity-50"
            >
                {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                {isSeeding ? 'Injecting...' : 'Seed System Data'}
            </button>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800">
          <button 
            onClick={() => auth.signOut()}
            className="flex items-center gap-2 text-zinc-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Terminal Shutdown
          </button>
        </div>

        <div className="mt-auto p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
          <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase mb-1">
            <ShieldAlert className="w-3 h-3" /> Managed Node
          </div>
          <p className="text-[10px] text-zinc-600 leading-tight">
            Infrastructure by NextGen Build Labs. Security Audit: PASS.
          </p>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">
              Admin <span className="text-indigo-500">Node</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-green-500" />
               <p className="text-zinc-500 text-xs font-mono">AGENCY_OS_v4 // SECURE_SOCKET_ESTABLISHED</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl">
             <div className="px-4 py-2 text-center border-r border-zinc-800">
                <div className="text-[10px] font-black text-zinc-600 uppercase">Revenue</div>
                <div className="text-lg font-bold text-white font-mono tracking-tighter">${totalRevenue.toLocaleString()}</div>
             </div>
             <div className="px-4 py-2 text-center">
                <div className="text-[10px] font-black text-zinc-600 uppercase">Pending</div>
                <div className="text-lg font-bold text-indigo-400 font-mono tracking-tighter">${pendingPayments.toLocaleString()}</div>
             </div>
          </div>
        </header>

        {/* Global Insight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">Total Leads</div>
              <div className="text-2xl font-bold text-white">{leads.length}</div>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">Total Clients</div>
              <div className="text-2xl font-bold text-white">{users.filter(u => u.role === UserRole.CLIENT).length}</div>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">Active Builds</div>
              <div className="text-2xl font-bold text-white tracking-widest text-indigo-400">{projects.filter(p => p.status !== 'COMPLETED').length}</div>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">Gross Revenue</div>
              <div className="text-2xl font-bold text-white tracking-tighter">${totalRevenue.toLocaleString()}</div>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">Pending Invoices</div>
              <div className="text-2xl font-bold text-red-500 tracking-tighter">${pendingPayments.toLocaleString()}</div>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-zinc-600 uppercase mb-2">Renewals Due</div>
              <div className="text-2xl font-bold text-orange-400">{invoices.filter(i => i.status === 'PENDING').length}</div>
           </div>
        </div>

        {/* Modules */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
          {activeTab === 'users' && (
            <div className="p-0">
               <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500" /> Identity Management</h2>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all">Invite Staff</button>
               </div>
               <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                      <th className="px-8 py-4">User</th>
                      <th className="px-8 py-4">Role</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {users.map(u => (
                      <tr key={u.uid} className="hover:bg-white/5 transition-all group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400">{u.email?.[0].toUpperCase()}</div>
                            <div>
                                <div className="text-sm font-bold text-white leading-none mb-1">{u.displayName || 'Guest'}</div>
                                <div className="text-xs text-zinc-500 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${u.role === UserRole.SUPERADMIN ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' : 'border-zinc-700 text-zinc-500 bg-zinc-800'}`}>
                            {u.role}
                          </span>
                          {u.active !== 'active' && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase border border-red-500/30 text-red-500 bg-red-500/10">
                              {u.active}
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => toggleSuspension(u.uid, u.active)} className={`p-2 rounded-lg transition-all ${u.active !== 'active' ? 'text-green-500 bg-green-500/10' : 'text-zinc-600 bg-zinc-800'}`}>
                              {u.active !== 'active' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}

          {activeTab === 'leads' && (
            <div>
               <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-indigo-500" /> Lead Pipeline</h2>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{leads.length} Active Leads</div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                        <th className="px-8 py-4">Contact</th>
                        <th className="px-8 py-4">Source</th>
                        <th className="px-8 py-4 text-right">Age</th>
                        <th className="px-8 py-4 text-right">Managed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {leads.map(l => (
                        <tr key={l.id} className="hover:bg-white/5 transition-all group">
                          <td className="px-8 py-5">
                            <div className="text-sm font-bold text-white leading-none mb-1">{l.name}</div>
                            <div className="text-xs text-zinc-500 font-mono">{l.email}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">{l.source}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="text-[10px] font-black text-white">{Math.floor((Date.now() - (l.createdAt || Date.now())) / (1000 * 60 * 60 * 24))}D</div>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <button onClick={() => deleteItem('leads', l.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div>
               <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-500" /> Agency Portfolio</h2>
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{clients.length} Registered Entities</div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800 text-[10px] uppercase font-black text-zinc-600 tracking-widest">
                        <th className="px-8 py-4">Company</th>
                        <th className="px-8 py-4">Contact</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-right">Managed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {clients.map(c => (
                        <tr key={c.id} className="hover:bg-white/5 transition-all group">
                          <td className="px-8 py-5">
                            <div className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{c.companyName}</div>
                            <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase">{c.projectType}</div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm font-bold text-zinc-300 mb-0.5">{c.contactPerson}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{c.email}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border ${
                              c.status === 'ACTIVE' 
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' 
                              : 'border-red-500/30 text-red-500 bg-red-500/10'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <button onClick={() => deleteItem('clients', c.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
               <div className="p-8 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-500" /> Project Workspace</h2>
                    <div className="hidden md:flex items-center gap-2">
                      {['ALL', 'PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status as any)}
                          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                            statusFilter === status
                              ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                              : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700 hover:text-zinc-400'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowProjectForm(!showProjectForm)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    {showProjectForm ? 'Cancel Initialization' : '+ Initialize Build'}
                  </button>
               </div>
               
               {/* Mobile Filter */}
               <div className="md:hidden px-8 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                  {['ALL', 'PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                        statusFilter === status
                          ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30'
                          : 'bg-zinc-950 text-zinc-600 border-zinc-800'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
               </div>

               {showProjectForm && (
                 <div className="p-8 bg-zinc-900/50 border-b border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleAddProject} className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Project Title</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. Enterprise Cloud Migration"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                            value={newProject.title}
                            onChange={e => setNewProject({...newProject, title: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Target Client UID</label>
                          <select 
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                            value={newProject.clientId}
                            onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                          >
                             <option value="">Select Target Client</option>
                             {users.filter(u => u.role === UserRole.CLIENT).map(u => (
                               <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
                             ))}
                          </select>
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Infrastructure Scope</label>
                          <textarea 
                            required
                            rows={3}
                            placeholder="Summary of deployment goals..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                            value={newProject.description}
                            onChange={e => setNewProject({...newProject, description: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Budget ($)</label>
                          <input 
                            required
                            type="number" 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                            value={newProject.budget}
                            onChange={e => setNewProject({...newProject, budget: parseInt(e.target.value)})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">SLA Deadline</label>
                          <input 
                            required
                            type="date" 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none transition-all"
                            value={newProject.deadline}
                            onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                          />
                       </div>
                       <div className="md:col-span-2">
                          <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-500/20 transition-all">
                             Authorize Build Deployment
                          </button>
                       </div>
                    </form>
                 </div>
               )}

               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 {filteredProjects.length === 0 ? (
                   <div className="md:col-span-2 py-20 text-center">
                      <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-20">
                        <Layers className="w-8 h-8" />
                      </div>
                      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Deployment Queue Clear // No Matching Nodes</p>
                   </div>
                 ) : (
                   filteredProjects.map(p => (
                   <div key={p.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-4 group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-zinc-900 rounded-xl group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div className="flex gap-2">
                           <button className="text-zinc-600 hover:text-white"><ExternalLink className="w-4 h-4" /></button>
                           <button onClick={() => deleteItem('projects', p.id)} className="text-zinc-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white mb-1">{p.title}</h3>
                        <p className="text-xs text-zinc-500 truncate">{p.description}</p>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between text-[10px] items-center">
                          <span className="text-zinc-600 font-black uppercase">Progress Engine</span>
                          <div className="flex items-center gap-4">
                             <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={p.progress}
                                onChange={(e) => handleProjectUpdate(p.id, { progress: parseInt(e.target.value) })}
                                className="w-24 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                             />
                             <span className="text-indigo-500 font-bold w-12 text-right">{p.progress}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="text-[10px] text-zinc-600 font-black uppercase">Lifecycle State</div>
                            <select 
                                value={p.status}
                                onChange={(e) => handleProjectUpdate(p.id, { status: e.target.value as any })}
                                className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[10px] font-bold text-zinc-400 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="REVIEW">REVIEW</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        </div>

                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <div className="h-full bg-indigo-600 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                   </div>
                  )))}
               </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div>
               <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Headphones className="w-5 h-5 text-indigo-500" /> Support Desk</h2>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-zinc-500">Response SLA: <span className="text-white font-bold">98.4%</span></span>
                  </div>
               </div>
               <div className="p-8 space-y-4">
                 {tickets.length === 0 ? (
                   <div className="p-12 text-center text-zinc-700 font-bold uppercase tracking-widest text-xs border border-zinc-800 rounded-3xl border-dashed">No active tickets requiring intervention</div>
                 ) : (
                   tickets.map(t => (
                     <div key={t.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                           <div className={`w-1 h-12 rounded-full ${t.priority === 'URGENT' ? 'bg-red-500' : 'bg-indigo-500'}`} />
                           <div>
                              <h4 className="font-bold text-white leading-none mb-2">{t.subject}</h4>
                              <p className="text-xs text-zinc-500 leading-tight line-clamp-1">{t.message}</p>
                           </div>
                        </div>
                        <button className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all">
                          <MessageSquare className="w-5 h-5 text-indigo-400" />
                        </button>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}
          {activeTab === 'payments' && (
            <div>
               <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><CircleDollarSign className="w-5 h-5 text-indigo-500" /> Financial Transactions</h2>
                  <div className="flex gap-4">
                    <div className="text-right">
                       <div className="text-[10px] text-zinc-500 uppercase font-black">Gross Revenue</div>
                       <div className="text-lg font-bold text-white font-mono tracking-tighter">${totalRevenue.toLocaleString()}</div>
                    </div>
                  </div>
               </div>
               <div className="p-8 space-y-4">
                 {invoices.length === 0 ? (
                   <div className="p-20 text-center text-zinc-800 font-black uppercase text-xs">No transactions recorded in the current fiscal period.</div>
                 ) : (
                   invoices.map(inv => (
                     <div key={inv.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${inv.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>$</div>
                           <div>
                              <div className="text-sm font-bold text-white">{inv.plan || 'Project Build'} - INV_{inv.id.slice(0, 5).toUpperCase()}</div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Due: {inv.dueDate} • {inv.method}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-lg font-bold text-white font-mono tracking-tighter">${inv.amount}</div>
                           <div className={`text-[10px] font-black uppercase tracking-widest ${inv.status === 'PAID' ? 'text-green-500' : 'text-red-500'}`}>{inv.status}</div>
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
               <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-500" /> Staff Operations</h2>
                  <span className="text-xs font-bold text-zinc-500 uppercase">{staff.length} Active Nodes</span>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {staff.map(member => (
                   <div key={member.uid} className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col items-center text-center group transition-all hover:border-indigo-500/20">
                      <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 text-xl font-black text-indigo-500 shadow-xl shadow-indigo-500/5 group-hover:shadow-indigo-500/20 transition-all">
                        {member.displayName?.[0] || member.email?.[0]}
                      </div>
                      <h3 className="font-bold text-white text-lg leading-none mb-1">{member.displayName}</h3>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">{member.role.replace('_', ' ')}</p>
                      <div className="w-full h-px bg-zinc-800 mb-6" />
                      <div className="w-full flex justify-between px-2">
                        <div className="text-center">
                           <div className="text-[9px] font-black text-zinc-600 uppercase">Efficiency</div>
                           <div className="text-sm font-bold text-white font-mono">94%</div>
                        </div>
                        <div className="text-center">
                           <div className="text-[9px] font-black text-zinc-600 uppercase">Uptime</div>
                           <div className="text-sm font-bold text-white font-mono">168h</div>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
               <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-500" /> System Notifications</h2>
                  <span className="text-xs font-bold text-zinc-500 uppercase">{notifications.length} Unresolved Alerts</span>
               </div>
               <div className="p-8 space-y-4">
                 {notifications.length === 0 ? (
                   <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
                        <Bell className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Atmosphere clear • No critical alerts detected</p>
                   </div>
                 ) : (
                   notifications.map(notif => (
                     <div key={notif.id} className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-start gap-4 group hover:border-indigo-500/30 transition-all">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                           <Activity className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                              <span className="text-[9px] font-mono text-zinc-600 uppercase">SIGNAL_SENT: {new Date(notif.createdAt).toLocaleTimeString()}</span>
                           </div>
                           <p className="text-xs text-zinc-500 leading-relaxed">{notif.message}</p>
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
