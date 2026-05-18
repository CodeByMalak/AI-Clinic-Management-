import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, Activity, Users, Shield, Calendar, 
  Stethoscope, FileText, Pill, ClipboardList, 
  User, LayoutDashboard, Settings, X 
} from 'lucide-react';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();

  const getLinks = () => {
    const baseLinks = [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
    ];

    if (user?.role === 'Admin') {
      return [
        ...baseLinks,
        { to: '/dashboard/users', icon: Users, label: 'Manage Users' },
        { to: '/dashboard/analytics', icon: Activity, label: 'Analytics' },
      ];
    }
    if (user?.role === 'Doctor') {
      return [
        ...baseLinks,
        { to: '/dashboard/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/dashboard/patients', icon: Users, label: 'My Patients' },
        { to: '/dashboard/prescriptions', icon: Pill, label: 'Prescriptions' },
      ];
    }
    if (user?.role === 'Receptionist') {
      return [
        ...baseLinks,
        { to: '/dashboard/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/dashboard/patients', icon: Users, label: 'All Patients' },
      ];
    }
    if (user?.role === 'Patient') {
      return [
        ...baseLinks,
        { to: '/dashboard/appointments', icon: Calendar, label: 'My Appointments' },
        { to: '/dashboard/prescriptions', icon: Pill, label: 'My Prescriptions' },
        { to: '/dashboard/records', icon: FileText, label: 'Medical Records' },
      ];
    }
    return baseLinks;
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col justify-between p-6 border-r border-slate-800 h-screen transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-clinical-500 flex items-center justify-center text-white shadow-lg shadow-clinical-500/20">
                <Activity className="w-5 h-5 animate-pulse-glow" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg tracking-tight text-white leading-tight">MediFlow</h3>
                <span className="text-[10px] text-clinical-400 font-bold uppercase tracking-wider block">Clinical Portal</span>
              </div>
            </div>
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Widget */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800/50 mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-clinical-500/10 border border-clinical-500/20 text-clinical-400 flex items-center justify-center font-bold text-sm shrink-0">
                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-clinical-500/20 text-clinical-300 text-[9px] font-black uppercase tracking-wider whitespace-nowrap">
                  {user?.role === 'Admin' && <Shield className="w-2.5 h-2.5" />}
                  {user?.role === 'Doctor' && <Stethoscope className="w-2.5 h-2.5" />}
                  {user?.role === 'Receptionist' && <ClipboardList className="w-2.5 h-2.5" />}
                  {user?.role === 'Patient' && <User className="w-2.5 h-2.5" />}
                  {user?.role || 'Guest'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
                      isActive 
                        ? 'bg-clinical-600/10 text-clinical-400 border border-clinical-600/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer Navigation */}
          <div className="pt-6 mt-6 border-t border-slate-800 shrink-0 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-850 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/20 text-slate-300 hover:text-rose-400 font-semibold text-xs tracking-wider uppercase transition-all duration-200 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
