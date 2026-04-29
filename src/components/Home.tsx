import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Code2, 
  Cpu, 
  Globe, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  MessageSquare,
  TrendingUp,
  Layout,
  ShieldCheck,
  Award,
  Users2,
  Clock,
  Sparkles
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
    const navigate = useNavigate();

    const servicesPreview = [
        { icon: Layout, title: "Web Dev", desc: "High-performance digital products built for scale." },
        { icon: Smartphone, title: "Mobile Apps", desc: "Native & cross-platform solutions for iOS/Android." },
        { icon: Cpu, title: "AI Systems", desc: "Intelligent automation & LLM integrations." }
    ];

    const testimonials = [
        { name: "Sarah J.", company: "TechFlow", text: "NextGen transformed our legacy system into a high-speed engine in weeks." },
        { name: "David M.", company: "Lumina", text: "The AI automation they built saves us 20+ hours of manual work weekly." }
    ];

    return (
        <div className="bg-zinc-950 min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <main className="pt-24 pb-8 px-6">
                <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <span className="px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">
                            Global Digital Engineering Labs
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-[7.2rem] font-black text-white tracking-tighter mb-5 leading-[0.85] max-w-6xl italic"
                    >
                        We Build Websites, Apps & <span className="text-indigo-500">AI Solutions</span> for Growth
                    </motion.h1>
 
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-8 font-medium leading-[1.6]"
                    >
                        Custom digital infrastructure for startups and global brands. We bridge the gap between heavy engineering and high-end design.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
                    >
                        <button 
                            onClick={() => navigate('/contact')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4.5 px-14 rounded-2xl transition-all shadow-2xl shadow-indigo-500/40 flex items-center justify-center gap-3 group relative overflow-hidden text-base h-[64px]"
                        >
                            <span className="relative z-10">GET QUOTE TODAY</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                        <button 
                            onClick={() => navigate('/portfolio')}
                            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-black py-4.5 px-14 rounded-2xl transition-all flex items-center justify-center border-t-zinc-700/50 text-base h-[64px]"
                        >
                            VIEW PORTFOLIO
                        </button>
                        <a 
                            href="https://wa.me/your-number"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 hover:shadow-2xl hover:shadow-emerald-500/30 text-emerald-500 font-black py-4.5 px-14 rounded-2xl transition-all flex items-center justify-center gap-2 text-base h-[64px]"
                        >
                           <MessageSquare className="w-5 h-5" /> WHATSAPP US
                        </a>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 pt-12 border-t border-zinc-900 w-full grid grid-cols-2 md:grid-cols-4 gap-12 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default"
                    >
                        <div className="flex items-center justify-center gap-4 group">
                             <ShieldCheck className="w-5 h-5 text-emerald-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Verified Secure</span>
                        </div>
                        <div className="flex items-center justify-center gap-4 group">
                             <Zap className="w-5 h-5 text-amber-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">High Performance</span>
                        </div>
                        <div className="flex items-center justify-center gap-4 group">
                             <Award className="w-5 h-5 text-indigo-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Premium Output</span>
                        </div>
                        <div className="flex items-center justify-center gap-4 group">
                             <Users2 className="w-5 h-5 text-zinc-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Global Connect</span>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Diagnostics / Stats */}
            <section className="py-10 bg-zinc-950 px-6">
                <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Systems Deployed', value: '50+', sub: 'Global Infrastructure' },
                        { label: 'Uptime Protocol', value: '99.9%', sub: 'Fail-Safe Guaranteed' },
                        { label: 'Support Reach', value: '24/7', sub: 'Always Online' },
                        { label: 'Growth Engine', value: '10x', sub: 'Average Scale' },
                    ].map((stat, i) => (
                        <div key={i} className="p-10 bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] text-center hover:bg-zinc-900/60 transition-colors">
                            <div className="text-4xl font-black text-white tracking-tighter mb-2 italic">{stat.value}</div>
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">{stat.label}</div>
                            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-zinc-900/30 border-y border-zinc-900 overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="flex-1">
                            <h2 className="text-5xl font-black text-white tracking-widest mb-12 uppercase italic">STRENGTH_INDEX</h2>
                            <div className="space-y-10">
                                {[
                                    { title: "Fast Delivery", text: "Production-ready code deployed in cycles, not years. Efficiency is our baseline." },
                                    { title: "Transparent Flow", text: "Real-time visibility through our Agency Portal. You see what we see." },
                                    { title: "AI-Integrated", text: "We don't just build apps; we build intelligent autonomous systems." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="w-12 h-12 shrink-0 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-2 italic uppercase tracking-tight">{item.title}</h4>
                                            <p className="text-zinc-500 font-medium leading-relaxed">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full flex items-center justify-center">
                            <motion.div 
                                animate={{ 
                                    rotate: [0, 5, 0, -5, 0],
                                    y: [0, -10, 0]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                className="w-full aspect-square max-w-lg bg-indigo-600/5 border border-indigo-500/20 rounded-[4rem] p-12 relative"
                            >
                                <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] rounded-full" />
                                <div className="relative z-10 w-full h-full border border-indigo-500/30 rounded-[3rem] p-10 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <Zap className="w-16 h-16 text-indigo-500" />
                                        <TrendingUp className="w-10 h-10 text-indigo-400 opacity-50" />
                                    </div>
                                    <div>
                                        <div className="h-3 w-3/4 bg-indigo-500/20 rounded-full mb-4" />
                                        <div className="h-3 w-1/2 bg-indigo-500/10 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Portfolio Mockups */}
            <section className="py-20 px-6 bg-zinc-950">
                 <div className="max-w-[1440px] mx-auto">
                    <div className="flex items-end justify-between mb-16 gap-10">
                        <div className="max-w-2xl text-left">
                            <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.5em] mb-4 italic">Engineering Records</h2>
                            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-6">Visual_Protocols</h3>
                            <p className="text-zinc-500 text-lg font-medium">Selected deployments highlighting our standard for visual and technical precision.</p>
                        </div>
                        <button onClick={() => navigate('/portfolio')} className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] hover:text-white transition-colors pb-2 border-b border-indigo-500/30">View All Assets →</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            { title: 'Solar Analytics Platform', tag: 'Data Visualisation', icon: Layout },
                            { title: 'Logistics Control Node', tag: 'Enterprise CRM', icon: Cpu }
                        ].map((proj, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10 }}
                                onClick={() => navigate('/portfolio')}
                                className="group cursor-pointer flex flex-col h-full"
                            >
                                <div className="aspect-[16/10] bg-zinc-900 rounded-[3.5rem] border border-zinc-800 overflow-hidden relative mb-8 group-hover:border-indigo-500/30 transition-all shadow-2xl shadow-black h-full flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-24 h-24 border border-white/5 rounded-[2rem] flex items-center justify-center">
                                         <proj.icon className="w-12 h-12 text-zinc-800 group-hover:text-indigo-500 transition-all duration-500" />
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6 h-1.5 bg-zinc-950/50 rounded-full overflow-hidden">
                                        <motion.div 
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            className="w-1/2 h-full bg-indigo-500/30" 
                                        />
                                    </div>
                                </div>
                                <div className="px-6 text-left">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-2 inline-block">{proj.tag}</span>
                                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{proj.title}</h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* Testimonials - Redesigned Dark Version */}
            <section className="py-28 bg-zinc-950 px-6 relative overflow-hidden border-y border-zinc-900">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />
                
                <div className="max-w-[1440px] mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-indigo-500 opacity-60 italic mb-6">Social_Validation</h2>
                        <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-[0.8]">TRUSTED_BY_<span className="text-zinc-800">LEADERS</span></h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah J.", company: "TechFlow", text: "NextGen transformed our legacy system into a high-speed engine in weeks. Absolute game changer." },
                            { name: "David M.", company: "Lumina", text: "The AI automation they built saves us 20+ hours of manual work weekly. Highly recommend their lab." },
                            { name: "Alex R.", company: "Vertex", text: "Precision engineering and beautiful UI. They understood our vision from day one." }
                        ].map((t, i) => (
                            <div key={i} className="text-left bg-zinc-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-zinc-800 hover:border-indigo-500/20 transition-all duration-500 group flex flex-col h-full">
                                <Sparkles className="w-8 h-8 text-indigo-500/30 group-hover:text-indigo-500 transition-colors mb-6" />
                                <p className="text-lg font-medium italic mb-8 leading-relaxed text-zinc-300">"{t.text}"</p>
                                <div className="flex items-center gap-5 mt-auto pt-6 border-t border-zinc-800/50">
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 text-xl">{t.name[0]}</div>
                                    <div className="text-left">
                                        <div className="font-bold text-white text-base leading-tight uppercase tracking-tight">{t.name}</div>
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1">{t.company}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="pt-20 pb-16 px-6 text-center">
                <div className="max-w-[1440px] mx-auto bg-zinc-900 border border-zinc-800 rounded-[5rem] p-16 md:p-24 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-widest uppercase italic mb-10 leading-[0.95]">READY_TO_<span className="text-indigo-500">DEPLOY?</span></h2>
                        <p className="text-zinc-500 mb-16 text-xl md:text-2xl font-medium leading-relaxed">
                            Stop waiting for the future. Build it today. Join the next generation of businesses running on high-impact digital systems.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <button 
                                onClick={() => navigate('/contact')}
                                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 px-16 rounded-3xl transition-all shadow-2xl shadow-indigo-500/40 uppercase tracking-[0.4em] text-sm shrink-0"
                            >
                                START SIGNAL
                            </button>
                            <button 
                                onClick={() => navigate('/services')}
                                className="w-full md:w-auto bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white font-black py-6 px-16 rounded-3xl transition-all uppercase tracking-[0.4em] text-sm shrink-0"
                            >
                                OUR PROTOCOLS
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
