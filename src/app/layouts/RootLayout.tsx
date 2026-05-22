import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Wallet,
  FileText,
  Settings,
  LogOut,
  DollarSign,
  Menu,
  X,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../store/useStore';

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/debts', icon: Receipt, label: 'Debts' },
    { path: '/payments', icon: Wallet, label: 'Payments' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4"
        style={{ background: 'linear-gradient(135deg, #065f46 0%, #0f172a 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 p-2 rounded-xl">
            <DollarSign className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight">DigiDebt</h1>
            <p className="text-xs text-emerald-300/70">v1.0.0</p>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ background: 'linear-gradient(160deg, #064e3b 0%, #0f172a 60%, #020617 100%)' }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-400/20 border border-emerald-400/30 p-2.5 rounded-xl shadow-lg shadow-emerald-900/50">
              <DollarSign className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight">DigiDebt</h1>
              <p className="text-xs text-emerald-400/60">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-900/50'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-400 rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-white/10">
          {/* Quick stats strip */}
          <div className="bg-white/5 rounded-xl p-3 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-slate-400 leading-tight">Multi-currency debt tracking</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
