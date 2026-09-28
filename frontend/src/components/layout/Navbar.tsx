import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationApi } from '../../services/api';
import { 
  Sparkles, Sun, Moon, Bell, ChevronDown, User as UserIcon,
  LogOut, Shield, Briefcase, GraduationCap, Menu, CheckCircle2, Trash2, ArrowRight
} from 'lucide-react';
import { Notification } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, logout, unreadCount, refreshNotifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifs();
    }
  }, [user]);

  const loadNotifs = async () => {
    try {
      setLoadingNotifs(true);
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch {} finally {
      setLoadingNotifs(false);
    }
  };

  const handleMarkRead = async (id: number, url?: string) => {
    await notificationApi.markAsRead(id);
    refreshNotifications();
    loadNotifs();
    if (url) {
      navigate(url);
      setShowNotificationsMenu(false);
    }
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllAsRead();
    refreshNotifications();
    loadNotifs();
  };

  return (
    <header className="sticky top-0 z-40 glass-navbar px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Mobile Menu & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
                Career<span className="gradient-text">Pilot</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                AI OS
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 glass-panel">
          <Link
            to="/dashboard"
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/resume-analyzer"
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/resume-analyzer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ATS Resume
          </Link>
          <Link
            to="/jd-analyzer"
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/jd-analyzer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            JD Matcher
          </Link>
          <Link
            to="/roadmap"
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/roadmap'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Skill Roadmap
          </Link>
          <Link
            to="/mock-interview"
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/mock-interview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            AI Interview
          </Link>
          <Link
            to="/applications"
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname === '/applications'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Tracker
          </Link>
        </nav>

        {/* Right Actions: Notifications, Theme, Profile / Login */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Authenticated Actions */}
          {user ? (
            <>
              {/* Role Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-indigo-400">{role}</span>
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotificationsMenu(!showNotificationsMenu);
                    if (!showNotificationsMenu) loadNotifs();
                  }}
                  className="relative p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-[#090d16]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotificationsMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl p-3 shadow-2xl border border-white/15 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-indigo-400" /> Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-indigo-400 hover:underline font-semibold cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto custom-scrollbar space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleMarkRead(n.id, n.actionUrl)}
                            className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                              n.readStatus ? 'bg-slate-900/40 opacity-75' : 'bg-indigo-500/10 border border-indigo-500/20'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-white">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/40 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline-block text-xs font-medium text-slate-200 pr-1">
                    {user.fullName?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl p-2 shadow-2xl border border-white/15 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-400" />
                      <span>Profile & Dashboard</span>
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Subscription & Plan</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Unauthenticated Navigation Buttons */
            <div className="flex items-center gap-2">
              <Link to="/login">
                <button className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link to="/login">
                <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
