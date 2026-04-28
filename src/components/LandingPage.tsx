import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Globe, 
  Zap,
  Code2,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            NextGen <span className="text-indigo-500">Build Labs</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#managed" className="hover:text-white transition-colors">Managed Services</a>
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all border border-zinc-700/50"
          >
            Agency Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" /> Future-Proof Engineering
          </span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
            We Build. <br />
            <span className="text-zinc-500">You Scale.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From custom SaaS architectures to high-performance enterprise platforms. 
            NextGen Build Labs delivers production-grade solutions with a managed-service mindset.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-500/25">
              Start Your Build <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-bold rounded-xl transition-all"
            >
              Client Login
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="services" className="py-24 px-8 max-w-7xl mx-auto border-t border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Code2 className="w-6 h-6" />,
              title: "Architecture First",
              desc: "Scalable, modular systems designed for long-term growth and easy ownership transfer."
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Managed Security",
              desc: "Constant monitoring, automated backups, and military-grade encryption by default."
            },
            {
              icon: <Layers className="w-6 h-6" />,
              title: "Full-Stack Delivery",
              desc: "Frontend excellence paired with robust backend logic and real-time database management."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Domain Attribution & Agency Philosophy */}
      <section id="managed" className="py-24 bg-zinc-900/30">
        <div className="px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
                The NextGen <span className="text-indigo-500">Service Model</span>
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                By default, all builds are hosted and maintained at 
                <span className="text-indigo-400 font-mono text-sm ml-1 select-all">https://nextgenbuildlabs.unaux.com/</span>
                <br /><br />
                We provide a turnkey experience where you focus on your business goals while we handle the infrastructure, security, and updates. Full ownership transfer is always an option.
              </p>
              <ul className="space-y-4">
                {[
                  "Managed Hosting & Infrastructure",
                  "Weekly Security Audits",
                  "White-Glove Support Continuity",
                  "Transparent Ownership Paths"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full aspect-video bg-zinc-950 rounded-2xl border border-zinc-800 p-8 flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Globe className="w-32 h-32 text-indigo-500" />
               </div>
               <div className="flex items-center gap-2 mb-8">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
               </div>
               <div className="space-y-4 font-mono text-xs">
                  <div className="text-indigo-400">$ nextgen init --managed</div>
                  <div className="text-zinc-500">{`> Provisioning secure cloud cluster...`}</div>
                  <div className="text-zinc-500">{`> Setting up NextGen Auth v4.2...`}</div>
                  <div className="text-green-400">{`> Build deployed to https://nextgenbuildlabs.unaux.com/`}</div>
                  <div className="animate-pulse inline-block w-2 h-4 bg-zinc-600 align-middle ml-1" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-zinc-500 text-sm">
            © 2026 NextGen Build Labs. All rights reserved. Managed Secure Hosting.
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-zinc-500 hover:text-indigo-400 text-sm flex items-center gap-1 transition-colors"
            >
              Client Login <ChevronRight className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-zinc-800" />
            <span className="text-zinc-600 text-xs font-mono">
              v1.0.4-production
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
