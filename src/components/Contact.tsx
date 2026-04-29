import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  CheckCircle,
  Loader2,
  ExternalLink,
  Globe,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        need: 'Website Development',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'leads'), {
                ...formData,
                source: 'WEB_FORM',
                status: 'NEW',
                createdAt: Date.now()
            });
            setIsSuccess(true);
            setFormData({ name: '', email: '', phone: '', need: 'Website Development', message: '' });
        } catch (err) {
            handleFirestoreError(err, OperationType.CREATE, 'leads');
            alert('Signal failed to deploy. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-zinc-950 min-h-screen">
            <Navbar />
            
            <header className="pt-24 pb-12 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 inline-block italic">Signal Uplink</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[0.9]">Initialize <span className="text-zinc-600">Contact</span></h1>
                        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Ready to build? Send your project parameters and we'll respond with a custom quote protocol.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-8 pb-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        {/* Contact Info */}
                        <div className="space-y-10 lg:pt-4">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-widest uppercase italic mb-6 leading-none">DIRECT_CHANNELS</h2>
                                <p className="text-zinc-500 font-medium mb-10 leading-relaxed text-base max-w-md">
                                    Whether you have a specific RFP or just want to explore AI automation possibilities, our lines are open. 24-hour response window guaranteed.
                                </p>
                                
                                <div className="space-y-4">
                                    <a href="mailto:nextgenbuildlabs@gmail.com" className="flex items-center gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-indigo-500/30 transition-all group">
                                        <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Primary Email</div>
                                            <div className="text-white font-bold text-sm">nextgenbuildlabs@gmail.com</div>
                                        </div>
                                    </a>

                                    <a href="https://wa.me/918940735144" target="_blank" className="flex items-center gap-6 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-emerald-500/30 transition-all group">
                                        <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">WhatsApp Fastline</div>
                                            <div className="text-white font-bold text-sm flex items-center gap-2">Start WhatsApp Consultation <ExternalLink className="w-3 h-3 opacity-30" /></div>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[3rem] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/20 transition-colors" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black italic tracking-tighter mb-4 leading-none uppercase text-white">Quote Policy</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                                        All initial quotes are free and confidential. We provide detailed scope breakdowns and transparent cost structures before any invoice is issued.
                                    </p>
                                    <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <CheckCircle className="w-5 h-5 shadow-inner" />
                                         </div>
                                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Enterprise Grade Security</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col">
                            {isSuccess ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-20 flex flex-col items-center justify-center text-center h-full"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white italic uppercase mb-2 leading-none">Request Received</h3>
                                    <p className="text-zinc-500 font-medium mb-8">We'll contact you soon.</p>
                                    <button 
                                        onClick={() => setIsSuccess(false)}
                                        className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-white transition-colors"
                                    >
                                        Send New Signal
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Full Identity</label>
                                            <input 
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                placeholder="e.g., John Sterling"
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Email Channel</label>
                                            <input 
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                                placeholder="contact@company.com"
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Phone Link</label>
                                            <input 
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                placeholder="+91 89407 35144"
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Objective</label>
                                            <select 
                                                value={formData.need}
                                                onChange={e => setFormData({...formData, need: e.target.value})}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium appearance-none text-sm cursor-pointer"
                                            >
                                                <option>Website Development</option>
                                                <option>Mobile App Development</option>
                                                <option>AI Automation</option>
                                                <option>E-commerce Stores</option>
                                                <option>SEO Strategy</option>
                                                <option>Other / Managed Service</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-4">Mission Details</label>
                                        <textarea 
                                            required
                                            value={formData.message}
                                            onChange={e => setFormData({...formData, message: e.target.value})}
                                            rows={4}
                                            placeholder="Describe your digital goals..."
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-medium resize-none text-sm"
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <button 
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3 relative group overflow-hidden"
                                        >
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SEND PROJECT REQUEST <Send className="w-4 h-4" /></>}
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        </button>
                                        
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                                                Replies within 24 hours • NDA Friendly • Global Support
                                            </p>
                                        </div>
                                    </div>
                                </form>

                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
