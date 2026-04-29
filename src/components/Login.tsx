import React, { useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Terminal, LogIn, ChevronLeft, Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailView, setIsEmailView] = React.useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in');
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError(null);
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Reset link sent to your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    console.info(`[NextGen Auth] Attempting login for project: ${auth.app.options.projectId}`);

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      navigate('/dashboard');
    } catch (authErr: any) {
      console.error('Auth Error Code:', authErr.code);
      console.error('Auth Error Message:', authErr.message);
      
      if (authErr.code === 'auth/operation-not-allowed') {
        setError(`CRITICAL: Email/Password login is DISABLED for project '${auth.config?.apiKey?.slice(0, 5)}...'. Please enable it in Firebase Console > Authentication > Sign-in Method.`);
      } else if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
        setError("Login unsuccessful. Please verify your email and passcode. Note: Super Admin accounts must be registered in the 'nextgen-build-labs' Firebase project.");
      } else if (authErr.code === 'auth/network-request-failed') {
        setError("Network error. Please check your connection to Firebase services.");
      } else {
        setError(`${authErr.message} (Code: ${authErr.code})`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md -mt-24"
      >
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-colors mb-8 group mx-auto md:mx-0"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Brand Website
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 lg:p-12 shadow-[0_0_50px_-12px_rgba(79,70,229,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mb-10 relative z-10">
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(79, 70, 229, 0.3)", 
                  "0 0 40px rgba(79, 70, 229, 0.5)", 
                  "0 0 20px rgba(79, 70, 229, 0.3)"
                ] 
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/40"
            >
              <Terminal className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Agency_Portal</h1>
            <p className="text-zinc-500 mt-3 text-sm font-medium">
              Private dashboard for active clients <br /> and verified administrators.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-1">
              {["Track builds", "View updates", "Access invoices", "Direct support"].map((item, i) => (
                <span key={i} className="text-[8px] font-black uppercase tracking-widest text-zinc-600 italic">
                  {item} {i < 3 && "•"}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl mb-6 relative z-10">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-4 rounded-xl mb-6 relative z-10">
              {success}
            </div>
          )}

          {!isEmailView ? (
            <div className="space-y-4 relative z-10">
                <div className="flex flex-col items-center gap-3">
                  <motion.button 
                      whileHover={{ scale: 1.02, backgroundColor: '#f4f4f5' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleLogin}
                      className="w-full py-4 px-6 bg-white text-zinc-950 font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl uppercase tracking-tighter text-sm"
                  >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                      Secure Google Access
                  </motion.button>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Google Verified Authentication
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, borderColor: '#3f3f46', backgroundColor: 'rgba(255,255,255,0.03)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 border border-zinc-800 text-zinc-400 hover:text-white font-black rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] mt-2"
                >
                  Preview Client Dashboard
                </motion.button>

                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                  <p className="text-[10px] text-zinc-500 leading-tight font-bold">
                    <span className="text-indigo-400">MASTER ACCESS:</span> Authorized personnel must use secure SSO for control panel initialization.
                  </p>
                </div>
                <button 
                    onClick={() => setIsEmailView(true)}
                    className="w-full py-3 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                >
                    Internal Credentials
                </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4 relative z-10">
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Admin Email" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all text-white placeholder:text-zinc-700"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Agency Passcode" 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all text-white placeholder:text-zinc-700"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <button 
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    <ShieldCheck className="w-4 h-4" /> Access Control
                </button>
                <div className="flex justify-between items-center pt-2">
                    <button 
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isResetting}
                        className="text-[9px] font-black text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-widest disabled:opacity-50"
                    >
                        {isResetting ? 'Sending...' : 'Signal Reset'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => setIsEmailView(false)}
                        className="text-zinc-600 hover:text-zinc-400 text-[9px] font-black uppercase tracking-widest"
                    >
                        Return to SSO
                    </button>
                </div>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-zinc-800/50 text-center relative z-10">
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-black">
              Authorized Personnel Only
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 leading-none">
                Protected by NextGen Build Labs Infrastructure
            </p>
            <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em] leading-relaxed">
                Secure Access • Encrypted Sessions
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
