import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Terminal, Menu, X, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 py-3' : 'bg-transparent py-6'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Terminal className="text-white w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-black tracking-tighter text-white uppercase italic">NextGen Build</span>
                        <span className="text-[10px] font-black tracking-[0.3em] text-indigo-500 uppercase bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">Labs</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.path}
                            to={link.path}
                            className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                                location.pathname === link.path ? 'text-indigo-400' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    <div className="w-px h-4 bg-zinc-800" />

                    <button 
                        onClick={() => navigate(user ? '/dashboard' : '/login')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-2.5 px-5 rounded-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                    >
                        {user ? 'Dashboard' : 'Client Access'}
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-zinc-900 border-b border-zinc-800 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-xs font-black uppercase tracking-[0.2em] ${
                                        location.pathname === link.path ? 'text-indigo-400' : 'text-zinc-400'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button 
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    navigate(user ? '/dashboard' : '/login');
                                }}
                                className="bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl text-center"
                            >
                                {user ? 'Dashboard' : 'Client Access'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
