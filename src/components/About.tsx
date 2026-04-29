import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Zap, 
  DollarSign, 
  Globe2, 
  Headphones, 
  CheckCircle,
  Code2,
  Cpu
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
    const strengths = [
        { icon: Zap, title: "Fast Delivery", text: "We ship clean code in tight cycles, ensuring your time-to-market is minimized." },
        { icon: DollarSign, title: "Affordable Pricing", text: "Premium engineering doesn't have to be overpriced. We offer value-driven scalable rates." },
        { icon: Code2, title: "Custom Solutions", text: "No templates. Every line of code is written specifically for your unique business logic." },
        { icon: Globe2, title: "Global Service", text: "Operating across timezones, we provide 24/7 reliability for clients worldwide." },
        { icon: Headphones, title: "Ongoing Support", text: "We don't just 'hand over' the keys. We maintain, monitor, and scale your systems constantly." }
    ];

    return (
        <div className="bg-zinc-950 min-h-screen">
            <Navbar />
            
            <header className="pt-40 pb-32 px-6 border-b border-zinc-900 overflow-hidden relative">
                <div className="absolute -top-16 -right-16 p-20 opacity-[0.03] pointer-events-none">
                    <Target className="w-[520px] h-[520px] text-white" />
                </div>
                <div className="max-w-[1440px] mx-auto relative z-10 text-center md:text-left px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl"
                    >
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-6 inline-block italic">The Mission Protocol</span>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black text-white tracking-[-0.06em] mb-10 leading-[0.9] italic">
                            BEHIND_THE_<span className="text-zinc-800">INFRASTRUCTURE</span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed mb-20">
                            We help modern businesses grow through high-performance websites, scalable applications, and intelligent automation systems engineered for results.
                        </p>

                        {/* Trust Elements Row */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-12 gap-y-6 pt-10 border-t border-zinc-900/50">
                            {[
                                "50+ Projects Delivered",
                                "99.9% Uptime Focus",
                                "Fast Support",
                                "Global Ready Solutions"
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{stat}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="py-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {/* Mission Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-28 items-center">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-widest uppercase italic mb-8">OBJECTIVE_X</h2>
                            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed mb-8">
                                In a world where digital transformation is no longer optional, we provide the technical leverage businesses need to scale without friction.
                            </p>
                            <div className="space-y-6">
                                <p className="text-zinc-500 font-medium leading-relaxed">
                                    Our lab is built on the principle that high-end engineering must be accessible, transparent, and results-oriented. We don't just build software; we architect the growth systems that define the next generation of industry leaders.
                                </p>
                                <p className="text-zinc-500 font-medium leading-relaxed">
                                    From custom ERPs to high-converting consumer platforms, our protocol ensures every deployment is a benchmark in performance and design.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex flex-col justify-between aspect-square group hover:border-indigo-500/30 transition-all shadow-2xl">
                                <Code2 className="w-10 h-10 text-indigo-500 mb-8" />
                                <div>
                                    <h4 className="text-4xl font-black text-white tracking-tighter mb-1">50+</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Systems Deployed</p>
                                </div>
                             </div>
                             <div className="p-10 bg-indigo-600 rounded-[2.5rem] flex flex-col justify-between aspect-square text-white shadow-2xl shadow-indigo-500/20">
                                <Cpu className="w-10 h-10 opacity-40 mb-8" />
                                <div>
                                    <h4 className="text-4xl font-black tracking-tighter mb-1">99.9%</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Uptime Reliability</p>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Strengths Grid */}
                    <div className="mb-32">
                         <h2 className="text-3xl font-black text-white tracking-widest uppercase italic mb-16 text-center">STRENGTH_ENFORCEMENT</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {strengths.map((str, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] group hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-950 text-zinc-600 group-hover:text-indigo-400 mb-8 transition-colors">
                                        <str.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 italic">{str.title}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed">{str.text}</p>
                                </motion.div>
                            ))}
                         </div>
                    </div>

                    {/* Founder/Credibility Section */}
                    <section className="py-20 px-8 bg-zinc-950 border border-zinc-900 rounded-[3rem] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-600/5" />
                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                                <Target className="w-10 h-10 italic" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Engineering Credibility</h3>
                                <p className="text-zinc-500 leading-relaxed max-w-2xl">
                                    NextGen Build Labs operates as a distributed engineering facility. Our team consists of verified cloud architects, frontend specialists, and AI researchers who have contributed to global-scale enterprise products.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
