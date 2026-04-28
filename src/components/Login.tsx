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

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs p-4 rounded-xl mb-6">
              {success}
            </div>
          )}

          {!isEmailView ? (
            <div className="space-y-4">
                <button 
                onClick={handleGoogleLogin}
                className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-zinc-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Secure Google Access
                </button>
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                  <p className="text-[10px] text-zinc-500 leading-tight">
                    <span className="text-indigo-400 font-bold">AGENCY OWNER:</span> Use the primary account for Master Control.
                  </p>
                </div>
                <button 
                    onClick={() => setIsEmailView(true)}
                    className="w-full py-3 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    Use Admin Credentials
                </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Admin Email" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 outline-none transition-all"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Agency Passcode" 
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-indigo-500/50 outline-none transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <button 
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <ShieldCheck className="w-4 h-4" /> Access Agency Control
                </button>
                <div className="flex justify-between items-center pt-2">
                    <button 
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isResetting}
                        className="text-[10px] font-bold text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-widest disabled:opacity-50"
                    >
                        {isResetting ? 'Sending...' : 'Issue Password Reset'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => setIsEmailView(false)}
                        className="text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest"
                    >
                        Return to SSO
                    </button>
                </div>
            </form>
          )}

          <p className="text-center text-zinc-600 text-[10px] uppercase tracking-widest font-bold pt-8">
            Authorized Personnel Only
          </p>
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
