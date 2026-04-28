import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  query,
  limit
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserProfile, Project, UserRole } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Lock, 
  Unlock, 
  ArrowLeft,
  Search,
  PlusCircle,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSuperAdmin) return;

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isSuperAdmin]);

  const toggleSuspension = async (uid: string, currentStatus: boolean) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { suspended: !currentStatus });
  };

  const createSampleProject = async (user: UserProfile) => {
    try {
      await addDoc(collection(db, 'projects'), {
        clientId: user.clientId || user.uid,
        title: `Build for ${user.displayName || user.email}`,
        description: 'New managed service project initiative.',
        status: 'IN_PROGRESS',
        progress: 10,
        manager: 'NextGen Build Labs',
        updatedAt: Date.now()
      });
      alert('Project created successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const promoteUser = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role: UserRole.CLIENT_ADMIN });
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agency Control Center</h1>
                    <p className="text-zinc-500 text-sm">Managed Service Master Dashboard</p>
                </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4" /> Super User Access
            </div>
        </header>

        <section className="grid grid-cols-1 gap-8">
            {/* User Management */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="text-indigo-500 w-6 h-6" />
                        <h2 className="text-xl font-bold">Client & User Directory</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input 
                            type="text" 
                            placeholder="Search accounts..." 
                            className="bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-widest font-black text-zinc-600">
                                <th className="px-8 py-4">User Identity</th>
                                <th className="px-8 py-4">Current Role</th>
                                <th className="px-8 py-4">Managed Status</th>
                                <th className="px-8 py-4 text-right">Administrative Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {users.map((u) => (
                                <tr key={u.uid} className="group hover:bg-white/5 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-400">
                                                {u.email?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{u.displayName || 'No Name'}</div>
                                                <div className="text-xs text-zinc-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                            u.role === UserRole.SUPER_ADMIN ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                            {u.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        {u.suspended ? (
                                            <span className="flex items-center gap-1.5 text-xs text-red-500 font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Suspended
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-xs text-green-500 font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                              onClick={() => createSampleProject(u)}
                                              className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors"
                                              title="Add Managed Project"
                                            >
                                                <PlusCircle className="w-5 h-5" />
                                            </button>
                                            {u.role === UserRole.CLIENT_USER && (
                                                <button 
                                                  onClick={() => promoteUser(u.uid)}
                                                  className="p-2 text-zinc-500 hover:text-indigo-400 transition-colors"
                                                  title="Promote to Client Admin"
                                                >
                                                    <Briefcase className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button 
                                              onClick={() => toggleSuspension(u.uid, u.suspended)}
                                              className={`p-2 transition-all ${u.suspended ? 'text-green-500 hover:text-green-400' : 'text-zinc-600 hover:text-red-500'}`}
                                              title={u.suspended ? 'Activate Account' : 'Suspend Access'}
                                            >
                                                {u.suspended ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && (
                    <div className="p-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest animate-pulse">
                        Synchronizing Agency Data...
                    </div>
                )}
            </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
