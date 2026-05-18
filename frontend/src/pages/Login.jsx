import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Heart, CheckCircle2, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, error, clearError, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // Clear errors on mount
    clearError();
  }, [isAuthenticated, navigate]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please provide a valid email format';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      // Success redirection
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Failed to log in:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Login Helper
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setIsSubmitting(true);
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    // Tiny delay to show simulation
    setTimeout(async () => {
      try {
        await login(demoEmail, demoPassword);
        const destination = location.state?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      } catch (err) {
        console.error('Failed demo login:', err.message);
      } finally {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex bg-medical-grid relative overflow-hidden bg-slate-900 text-white">
      
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-clinical-500/20 blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-500/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
        
        {/* Left Side: Brand Value Proposition & Info */}
        <div className="lg:w-1/2 flex flex-col justify-center pr-0 lg:pr-12 mb-10 lg:mb-0 text-center lg:text-left select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clinical-500/10 border border-clinical-500/20 text-clinical-300 text-xs font-semibold self-center lg:self-start mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Autonomous Clinical Hub
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-6">
            MediFlow <span className="bg-gradient-to-r from-clinical-400 via-clinical-300 to-accent-400 bg-clip-text text-transparent">AI</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
            Empower your health ecosystem with AI-assisted diagnostics, unified patient queuing, and frictionless role-based operations.
          </p>

          {/* Quick-links lists */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <span>JWT Signed Security</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <span>Diagnostic Assistant</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <span>Unified SaaS Portal</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-300 text-sm">
              <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <span>Dynamic RBAC Enforcer</span>
            </div>
          </div>
        </div>

        {/* Right Side: The Login Card */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Welcome Back</h2>
                <p className="text-xs text-slate-400">Initialize secure medical node access</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-clinical-500/20 border border-clinical-500/30 flex items-center justify-center text-clinical-400">
                <Heart className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex gap-2.5 items-start animate-pulse-glow">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold">Access Denied:</span> {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Security Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="dr.smith@mediflow.ai"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-850 border ${
                      formErrors.email ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-clinical-500 focus:ring-clinical-500/20'
                    } focus:outline-none focus:ring-4 transition-all duration-200 text-sm placeholder:text-slate-600 text-slate-200 bg-slate-900/60`}
                  />
                </div>
                {formErrors.email && <p className="text-rose-400 text-xxs font-medium">{formErrors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Access Keycode</label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-850 border ${
                      formErrors.password ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-clinical-500 focus:ring-clinical-500/20'
                    } focus:outline-none focus:ring-4 transition-all duration-200 text-sm placeholder:text-slate-600 text-slate-200 bg-slate-900/60`}
                  />
                </div>
                {formErrors.password && <p className="text-rose-400 text-xxs font-medium">{formErrors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-clinical-500 hover:bg-clinical-600 active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-clinical-500/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    <span>Decrypting Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Authorize Access</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-xs">
                First time at the clinic?{' '}
                <Link to="/register" className="text-clinical-400 hover:underline font-semibold transition-all">
                  Register User Credentials
                </Link>
              </p>
            </div>

            {/* Quick Demo Login Grid for Testing */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center mb-4">
                Clinical Node Quick Demo logins
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickLogin('admin@mediflow.ai', 'admin123')}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-medium transition-all text-center flex flex-col items-center justify-center group active:scale-95"
                >
                  <span className="text-clinical-400 font-bold group-hover:text-clinical-300">Admin Portal</span>
                  <span className="text-[9px] text-slate-500">admin@mediflow.ai</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('doctor@mediflow.ai', 'doctor123')}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-medium transition-all text-center flex flex-col items-center justify-center group active:scale-95"
                >
                  <span className="text-emerald-400 font-bold group-hover:text-emerald-300">Doctor AI</span>
                  <span className="text-[9px] text-slate-500">doctor@mediflow.ai</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('receptionist@mediflow.ai', 'receptionist123')}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-medium transition-all text-center flex flex-col items-center justify-center group active:scale-95"
                >
                  <span className="text-purple-400 font-bold group-hover:text-purple-300">Receptionist</span>
                  <span className="text-[9px] text-slate-500">receptionist@mediflow.ai</span>
                </button>
                <button
                  onClick={() => handleQuickLogin('patient@mediflow.ai', 'patient123')}
                  className="px-3 py-2 text-xs rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-medium transition-all text-center flex flex-col items-center justify-center group active:scale-95"
                >
                  <span className="text-amber-400 font-bold group-hover:text-amber-300">Patient Dashboard</span>
                  <span className="text-[9px] text-slate-500">patient@mediflow.ai</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
