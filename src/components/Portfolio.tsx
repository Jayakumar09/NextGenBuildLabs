import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ExternalLink, 
  ArrowRight,
  Monitor,
  Smartphone,
  Cpu,
  BarChart4,
  ShoppingBag
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Portfolio = () => {
    const navigate = useNavigate();

    const projects = [
        {
            title: "Solar Company Website",
            category: "Web Engineering",
            desc: "Custom high-performance platform for solar lead generation with interactive calculators.",
            icon: Monitor,
            result: "40% increase in lead conversions."
        },
        {
            title: "Plant ID Tamil App",
            category: "Mobile App",
            desc: "Regional language botanic identification app with localized AI recognition models.",
            icon: Smartphone,
            result: "50k+ active installations."
        },
        {
            title: "Admin CRM Dashboard",
            category: "Corporate Systems",
            desc: "Unified Intelligence interface for high-end logistics and personnel management.",
            icon: BarChart4,
            result: "Reduced operational lag by 60%."
        },
        {
            title: "AI Blog Generator",
            category: "Intelligent Systems",
            desc: "automated content engine leveraging Gemini for enterprise SEO strategies.",
            icon: Cpu,
            result: "Content output accelerated 10x."
        },
        {
            title: "E-commerce Store Demo",
            category: "Retail Tech",
            desc: "Headless commerce implementation with rapid checkout flows and stock automation.",
            icon: ShoppingBag,
            result: "Checkout time reduced to <2s."
        }
    ];

    return (
        <div className="bg-zinc-950 min-h-screen">
            <Navbar />
            
            <header className="pt-40 pb-20 px-6 border-b border-zinc-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 inline-block italic">NextGen Index</span>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-[0.9]">Selected <span className="text-zinc-600">Records</span></h1>
                            <p className="text-zinc-500 text-lg font-medium">
                                A curated look at the digital infrastructure we've architected for global clients.
                            </p>
                        </motion.div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic">Status</div>
                            <div className="flex items-center gap-2 text-emerald-500 font-black text-sm uppercase">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Engineering Open
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {projects.map((project, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -8 }}
                                transition={{ 
                                    opacity: { duration: 0.5, delay: i * 0.1 },
                                    y: { duration: 0.5, delay: i * 0.1 },
                                    default: { duration: 0.3 }
                                }}
                                viewport={{ once: true }}
                                className="group relative flex flex-col h-full"
                            >
                                <div className="relative aspect-[16/10] bg-zinc-900 rounded-[2.5rem] border border-zinc-800 overflow-hidden mb-8 transition-all group-hover:border-indigo-500/40 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    {/* Mockup Elements */}
                                    <div className="absolute inset-x-8 top-8 bottom-0 bg-zinc-950 border-t border-x border-zinc-800 rounded-t-3xl p-6 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-4 opacity-30">
                                            <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                            <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                            <div className="w-2 h-2 rounded-full bg-zinc-700" />
                                        </div>
                                        <div className="space-y-3 opacity-20">
                                            <div className="h-4 bg-zinc-800 rounded w-2/3" />
                                            <div className="h-24 bg-zinc-800/50 rounded" />
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="h-10 bg-zinc-800 rounded" />
                                                <div className="h-10 bg-zinc-800 rounded" />
                                                <div className="h-10 bg-zinc-800 rounded" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <project.icon className="w-16 h-16 text-zinc-800 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-700" />
                                        </div>
                                    </div>
                                    
                                    <div className="absolute top-6 right-6 z-20">
                                        <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-3 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                            <ExternalLink className="w-5 h-5 text-indigo-400" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="px-4 flex-grow">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2 inline-block italic">{project.category}</span>
                                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter italic">{project.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-lg">{project.desc}</p>
                                    
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">{project.result}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-32 p-16 bg-zinc-900 border border-zinc-800 rounded-[3rem] text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                        <h2 className="relative z-10 text-3xl font-black text-white tracking-widest uppercase italic mb-6">Want_Results_Like_These?</h2>
                        <p className="relative z-10 text-zinc-500 mb-10 max-w-lg mx-auto font-medium">
                            Every success story starts with an initial build protocol. Let's start yours.
                        </p>
                        <button 
                            onClick={() => navigate('/contact')}
                            className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-indigo-500/30 uppercase tracking-widest text-xs"
                        >
                            Initialize Build Proposal
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Portfolio;
