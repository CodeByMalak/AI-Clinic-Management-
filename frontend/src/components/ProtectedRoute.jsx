import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Activity } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show a professional loading state while validating token
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="relative mb-6">
            {/* Spinning outward rings */}
            <div className="w-16 h-16 rounded-full border-4 border-clinical-100 border-t-clinical-500 animate-spin"></div>
            {/* Central glowing heart pulse icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-6 h-6 text-clinical-500 animate-pulse-glow" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Verifying Credentials</h3>
          <p className="text-slate-500 text-sm">Please wait while we establish a secure connection to the medical node...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-medical-grid">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 shadow-glass border border-slate-200/60 text-center">
          <div className="w-16 h-16 mx-auto bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-500 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Access Restrained</h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your current security classification (<strong className="text-clinical-600 font-semibold">{user.role}</strong>) does not have privileges to view this partition. Please consult an administrator if this is an error.
          </p>

          <div className="p-4 bg-slate-100/50 rounded-2xl border border-slate-200/40 text-left mb-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Attempted Sector</div>
            <code className="text-xs text-rose-600 font-mono break-all">{location.pathname}</code>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-clinical-600 hover:bg-clinical-700 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-clinical-600/20 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
