import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TopNavbar = ({ setMobileMenuOpen }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200/60 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Left side: Mobile menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 lg:hidden rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden sm:flex items-center w-full max-w-md relative group">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 group-focus-within:text-clinical-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search patients, appointments, docs..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-700 focus:outline-none focus:border-clinical-500 focus:ring-2 focus:ring-clinical-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right side: Notifications & Profile */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">{user?.role || 'Guest'}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-clinical-100 text-clinical-600 flex items-center justify-center font-bold text-sm border border-clinical-200">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
