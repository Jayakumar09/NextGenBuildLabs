import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  ShoppingBag, 
  Search, 
  ArrowRight,
  Code2,
  Zap,
  Layout,
  Layers
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Services = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Website Development",
            desc: "Custom high-performance websites built with React, Next.js, and high-end animations. Optimized for speed and ranking.",
            icon: Globe,
            features: ["Responsive Design", "SEO Integration", "Performance Audit"]
        },
        {
            title: "Mobile App Development",
            desc: "Native and cross-platform mobile apps for iOS and Android. Minimalist UI with robust backend connectivity.",
            icon: Smartphone,
            features: ["App Store Deploy", "Real-time Sync", "Push Architecture"]
        },
        {
            title: "AI Automation",
            desc: "Leverage Gemini & OpenAI to automate your business processes. Custom AI agents and intelligent data extraction.",
            icon: Cpu,
            features: ["Workflow Logic", "LLM Integration", "Smart Analytics"]
        },
        {
            title: "E-commerce Stores",
            desc: "Scalable online stores with secure payment integration and management dashboards tailored for your inventory.",
            icon: ShoppingBag,
            features: ["Payment Gateways", "Stock Engines", "Sales Insights"]
        },
        {
            title: "SEO Landing Pages",
            desc: "Conversion-focused landing pages designed to turn clicks into customers. Built for speed and tracking.",
            icon: Search,
            features: ["A/B Ready", "Fast Load-times", "Lead Capture"]
        }
    ];

    return (
        <div className="bg-zinc-950 min-h-screen">
            <Navbar />
            
            <header className="pt-32 pb-16 px-6 text-center border-b border-zinc-900">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 inline-block italic">NextGen Suite</span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">Digital Engineering <span className="text-zinc-600">Protocols</span></h1>
                        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                            End-to-end development and automation services designed for modern scale and visual impact.
                        </p>
                    </motion.div>
                </div>
            </header>

            <main className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.6,
                                    delay: i * 0.15,
                                    ease: [0.21, 0.47, 0.32, 0.98]
                                }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 hover:border-indigo-500/40 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group flex flex-col h-full"
                            >
                                <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-600 group-hover:text-indigo-400 transition-colors mb-8">
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">{service.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-10 flex-grow">{service.desc}</p>
                                
                                <ul className="space-y-3 mb-10">
                                    {service.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                                            <Zap className="w-3 h-3 text-indigo-500/50" /> {f}
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => navigate('/contact')}
                                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-indigo-500/30 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                                >
                                    Initialize <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Tech Section */}
            <section className="py-24 bg-zinc-900 border-t border-zinc-800 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-black text-white tracking-widest uppercase italic mb-6">INFRA_STACK</h2>
                        <p className="text-zinc-500 font-medium">
                            Every project is deployed on secure cloud architecture with managed updates and 24/7 monitoring. We don't just build; we maintain the pulse.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: Code2, label: 'Modern SDKs' },
                            { icon: Layers, label: 'Cloud Clusters' },
                            { icon: Search, label: 'Audit Ready' },
                            { icon: Layout, label: 'UI Precision' }
                        ].map((tech, i) => (
                            <div key={i} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col items-center gap-3">
                                <tech.icon className="w-5 h-5 text-indigo-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{tech.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
