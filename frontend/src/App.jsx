import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* RBAC Route Demonstrations */}
          <Route
            path="/admin-only"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 bg-clinical-500/20 border border-clinical-500 rounded-3xl flex items-center justify-center mb-6">
                    <span className="text-clinical-400 font-extrabold text-lg">ADM</span>
                  </div>
                  <h1 className="text-3xl font-black mb-2">Restricted Admin Control Vault</h1>
                  <p className="text-slate-400 text-sm max-w-md mb-6">
                    If you are seeing this, your authentication credentials passed the strict Admin Role validation filter!
                  </p>
                  <a href="/dashboard" className="px-5 py-2.5 rounded-xl bg-clinical-600 hover:bg-clinical-700 text-sm font-semibold transition-all">
                    Return to Dashboard
                  </a>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirections */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
