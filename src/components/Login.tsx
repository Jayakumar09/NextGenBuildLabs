import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Terminal, LogIn, ChevronLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Brand Website
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
              <Terminal className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Agency Portal</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Secure login for NextGen Build Labs clients <br /> and administrators.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            <p className="text-center text-zinc-600 text-[10px] uppercase tracking-widest font-bold pt-4">
              Authorized Personnel Only
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-zinc-500 text-xs">
                Managed securely by NextGen Build Labs. <br />
                Terms of Service & Infrastructure Continuity apply.
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
