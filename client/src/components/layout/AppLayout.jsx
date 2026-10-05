import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  Sparkles,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Wheat
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <div className="bg-emerald-700 text-white p-2 rounded-xl shadow-xs">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                AgriAdvisor <span className="text-emerald-600 font-semibold">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block">
                Digital Crop Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>

              <NavLink
                to="/advisory/new"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-xs ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`
                }
              >
                <Sparkles className="h-4 w-4 text-emerald-200" />
                New Advisory
              </NavLink>

              <NavLink
                to="/advisories"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <History className="h-4 w-4" />
                History
              </NavLink>

              <NavLink
                to="/farms"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <Wheat className="h-4 w-4" />
                My Farms
              </NavLink>

              <div className="h-5 w-px bg-slate-200 mx-2" />

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-2.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
                title="Profile"
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{user.full_name?.split(' ')[0] || 'Profile'}</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                Dashboard
              </Link>
              <Link
                to="/advisory/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-700 text-white"
              >
                <Sparkles className="h-4 w-4" />
                New AI Advisory
              </Link>
              <Link
                to="/farms"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <Wheat className="h-4 w-4 text-emerald-600" />
                My Farms
              </Link>
              <Link
                to="/advisories"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <History className="h-4 w-4 text-emerald-600" />
                Advisory History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <User className="h-4 w-4 text-emerald-600" />
                Profile & Settings
              </Link>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-slate-700 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Agricultural Advisory Disclaimer</span>
        </div>
        <p className="max-w-2xl mx-auto leading-relaxed">
          AI-generated agricultural recommendations are decision-support guidelines and do not replace certified agronomists,
          official soil testing laboratories, or regional agricultural extension authorities (e.g., KVK/ICAR).
        </p>
        <p className="text-slate-400 pt-2">
          © {new Date().getFullYear()} AgriAdvisor AI Platform. Powered by Google Gemini.
        </p>
      </div>
    </footer>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
