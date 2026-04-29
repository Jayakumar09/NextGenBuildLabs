import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Twitter, Linkedin, Mail, Globe, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-4 mb-6 group">
                            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                 <Terminal className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-base font-black tracking-tighter text-white uppercase italic">NextGen Build</span>
                                <span className="text-[9px] font-black tracking-[0.2em] text-indigo-500 uppercase bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/10">Labs</span>
                            </div>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                            Websites • Mobile Apps • AI Solutions. Architecting the digital future with custom code and high-performance apps.
                        </p>
                        <div className="flex gap-4">
                            {[Github, Twitter, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Capabilities</h4>
                        <ul className="space-y-4">
                            {['App Engineering', 'AI Automation', 'SEO Engine', 'Cloud Systems'].map((item) => (
                                <li key={item}>
                                    <Link to="/services" className="text-zinc-500 hover:text-white text-sm transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Company</h4>
                        <ul className="space-y-4">
                            {['About Labs', 'Portfolio', 'Process', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item.toLowerCase().split(' ')[0]}`} className="text-zinc-500 hover:text-white text-sm transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-6">Direct Line</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-zinc-500 group">
                                <Mail className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                                <span className="text-sm">nextgenbuildlabs@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-500 group">
                                <Globe className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                                <a href="http://nextgenbuildlabs.unaux.com" target="_blank" rel="noreferrer" className="text-sm hover:text-white transition-colors">nextgenbuildlabs.unaux.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-500 group">
                                <MapPin className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                                <span className="text-sm">Tiruchirappalli, India</span>
                            </li>
                            <li className="pt-4">
                                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Global Systems Online</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        © 2026 NextGen Build Labs. Secure Infrastructure Guaranteed.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
