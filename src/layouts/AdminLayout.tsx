import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image as ImageIcon,
  Bell,
  Award,
  BarChart3,
  Settings,
  Mail,
  History,
  LogOut,
  Globe,
  ChevronLeft,
  ChevronRight,
  Code,
  ShieldCheck,
} from 'lucide-react';
import { AuthService } from '../services/authService';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidSession, setIsValidSession] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  React.useEffect(() => {
    let isMounted = true;
    AuthService.verifySession().then((valid) => {
      if (isMounted) {
        setIsValidSession(valid);
        setIsVerifying(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (!isVerifying && (!user || !isValidSession)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events Manager', path: '/admin/events', icon: Calendar },
    { name: 'Team Members', path: '/admin/team', icon: Users },
    { name: 'Gallery Albums', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Announcements', path: '/admin/announcements', icon: Bell },
    { name: 'Sponsors', path: '/admin/sponsors', icon: Award },
    { name: 'Community Stats', path: '/admin/statistics', icon: BarChart3 },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    { name: 'Messages Inbox', path: '/admin/messages', icon: Mail },
    { name: 'Activity Logs', path: '/admin/activity-logs', icon: History },
  ];

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#04060A] text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#080B12] border-r border-white/5 transition-all duration-300 flex flex-col justify-between ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/5">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan p-[1px] flex items-center justify-center shrink-0 overflow-hidden">
                <div className="w-full h-full bg-[#04060A] rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/coderush_logo.jpg" alt="CodeRush Logo" className="w-full h-full object-contain p-[1px]" />
                </div>
              </div>
              {!collapsed && (
                <div>
                  <span className="font-heading font-bold text-sm text-white block leading-none">
                    CODERUSH
                  </span>
                  <span className="text-[10px] text-brand-cyan font-mono block">
                    CMS ADMIN
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-brand-blue text-white shadow-glow-blue'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-white hover:bg-white/5 transition-all"
            title="View Live Website"
          >
            <Globe className="w-4 h-4 text-brand-cyan shrink-0" />
            {!collapsed && <span>Live Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Topbar */}
        <header className="h-16 bg-[#080B12]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-cyan" />
            <h1 className="font-heading font-semibold text-white text-base">
              CodeRush Content Management System
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <img
                src={user.profile_photo}
                alt={user.full_name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-white">{user.full_name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route View */}
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
