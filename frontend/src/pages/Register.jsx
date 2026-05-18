import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Stethoscope, AlertCircle, Heart, Sparkles, CheckSquare } from 'lucide-react';

const Register = () => {
  const { register, error, clearError, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [specialization, setSpecialization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    clearError();
  }, [isAuthenticated, navigate]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }
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
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (role === 'Doctor' && !specialization.trim()) {
      errors.specialization = 'Doctors must provide their clinical specialization';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = {
        name,
        email,
        password,
        role,
        specialization: role === 'Doctor' ? specialization : '',
        phoneNumber,
      };
      
      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to register:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-medical-grid relative overflow-hidden bg-slate-900 text-white py-12 px-4">
      
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-clinical-500/20 blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-500/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
        
        {/* Left Side: Brand features & testimonials */}
        <div className="lg:w-5/12 flex flex-col justify-center select-none text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clinical-500/10 border border-clinical-500/20 text-clinical-300 text-xs font-semibold self-center lg:self-start mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Establish Clinical Account Node
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none mb-6">
            Join <span className="bg-gradient-to-r from-clinical-400 via-clinical-300 to-accent-400 bg-clip-text text-transparent">MediFlow AI</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
            Create an unified secure account to seamlessly communicate with physicians, schedule smart queues, and evaluate diagnostic metrics in real-time.
          </p>

          <div className="space-y-4 max-w-md mx-auto lg:mx-0 text-left">
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex gap-3">
              <CheckSquare className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Select Your Dedicated Role</h4>
                <p className="text-xs text-slate-400">Custom interfaces tailored specifically for Doctors, Patients, Receptionists, and Admins.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex gap-3">
              <CheckSquare className="w-5 h-5 text-accent-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Cryptographic Data Vault</h4>
                <p className="text-xs text-slate-400">Hashed security via bcrypt algorithm and signed JSON Web Tokens securing every API transfer.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form Card */}
        <div className="w-full lg:w-7/12 max-w-xl">
          <div className="glass-panel-dark rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-800">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Create Account</h2>
                <p className="text-xs text-slate-400">Fill in the fields below to mount your credentials</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-clinical-500/20 border border-clinical-500/30 flex items-center justify-center text-clinical-400">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex gap-2.5 items-start animate-pulse-glow">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold">Registration Failed:</span> {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Responsive Row: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                      }}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-slate-900/60 text-slate-200 text-sm ${
                        formErrors.name ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-clinical-500'
                      } focus:outline-none focus:ring-4 focus:ring-clinical-500/10 transition-all`}
                    />
                  </div>
                  {formErrors.name && <p className="text-rose-400 text-xxs">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Clinical Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="jane.doe@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-slate-900/60 text-slate-200 text-sm ${
                        formErrors.email ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-clinical-500'
                      } focus:outline-none focus:ring-4 focus:ring-clinical-500/10 transition-all`}
                    />
                  </div>
                  {formErrors.email && <p className="text-rose-400 text-xxs">{formErrors.email}</p>}
                </div>
              </div>

              {/* Responsive Row: Phone & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-1234"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-clinical-500 focus:outline-none focus:ring-4 focus:ring-clinical-500/10 text-slate-200 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Assigned Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      // Clear specialization if not doctor
                      if (e.target.value !== 'Doctor') setSpecialization('');
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:border-clinical-500 focus:outline-none focus:ring-4 focus:ring-clinical-500/10 text-slate-300 text-sm transition-all"
                  >
                    <option value="Patient" className="bg-slate-950">Patient (General Public)</option>
                    <option value="Doctor" className="bg-slate-950">Doctor (Medical Faculty)</option>
                    <option value="Receptionist" className="bg-slate-950">Receptionist (Clinic Operations)</option>
                    <option value="Admin" className="bg-slate-950">Admin (System Director)</option>
                  </select>
                </div>
              </div>

              {/* Conditional Specialization Input (Fades/Animates in for Doctor) */}
              {role === 'Doctor' && (
                <div className="space-y-1.5 p-4 rounded-2xl bg-clinical-500/5 border border-clinical-500/20 animate-pulse-glow">
                  <label className="text-xs font-semibold text-clinical-300 uppercase tracking-wider block">Medical Specialization</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                      <Stethoscope className="w-4 h-4 text-clinical-400" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cardiology, Neuro-Oncology, Pediatrics"
                      value={specialization}
                      onChange={(e) => {
                        setSpecialization(e.target.value);
                        if (formErrors.specialization) setFormErrors({ ...formErrors, specialization: '' });
                      }}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-slate-900/60 text-slate-200 text-sm ${
                        formErrors.specialization ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-clinical-500'
                      } focus:outline-none focus:ring-4 focus:ring-clinical-500/10 transition-all`}
                    />
                  </div>
                  {formErrors.specialization && <p className="text-rose-400 text-xxs font-medium">{formErrors.specialization}</p>}
                </div>
              )}

              {/* Responsive Row: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Access Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
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
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-slate-900/60 text-slate-200 text-sm ${
                        formErrors.password ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-clinical-500'
                      } focus:outline-none focus:ring-4 focus:ring-clinical-500/10 transition-all`}
                    />
                  </div>
                  {formErrors.password && <p className="text-rose-400 text-xxs">{formErrors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Verify Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: '' });
                      }}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-slate-900/60 text-slate-200 text-sm ${
                        formErrors.confirmPassword ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-clinical-500'
                      } focus:outline-none focus:ring-4 focus:ring-clinical-500/10 transition-all`}
                    />
                  </div>
                  {formErrors.confirmPassword && <p className="text-rose-400 text-xxs">{formErrors.confirmPassword}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-clinical-500 hover:bg-clinical-600 active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-clinical-500/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                    <span>Initializing Account Node...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Safe Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-xs">
                Already registered?{' '}
                <Link to="/login" className="text-clinical-400 hover:underline font-semibold transition-all">
                  Authorize Existing Account
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
