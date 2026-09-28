import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, FileText, Target, Map, Search, 
  Kanban, Mic, Award, MessageSquare, Briefcase, 
  GraduationCap, Shield, Sparkles, Settings
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();

  const mainNav = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/resume-analyzer', label: 'ATS Resume Parser', icon: <FileText className="w-4 h-4" /> },
    { to: '/jd-analyzer', label: 'JD & Job Matching', icon: <Target className="w-4 h-4" /> },
    { to: '/roadmap', label: 'Skill Roadmap', icon: <Map className="w-4 h-4" /> },
    { to: '/job-search', label: 'Smart Job Search', icon: <Search className="w-4 h-4" /> },
    { to: '/applications', label: 'Application Tracker', icon: <Kanban className="w-4 h-4" /> },
    { to: '/mock-interview', label: 'AI Mock Interview', icon: <Mic className="w-4 h-4" /> },
    { to: '/assessments', label: 'Technical Assessment', icon: <Award className="w-4 h-4" /> },
  ];

  const roleNav = {
    RECRUITER: [
      { to: '/recruiter', label: 'Recruiter Dashboard', icon: <Briefcase className="w-4 h-4" /> },
    ],
    COLLEGE_ADMIN: [
      { to: '/college', label: 'Placement Dashboard', icon: <GraduationCap className="w-4 h-4" /> },
    ],
    ADMIN: [
      { to: '/admin', label: 'System Admin', icon: <Shield className="w-4 h-4" /> },
    ],
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-panel border-r border-white/10 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-auto lg:h-[calc(100vh-65px)]`}
      >
        <div className="space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Main Candidates Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Career Engine
            </div>
            <nav className="space-y-1">
              {mainNav.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-white/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Role Specific Section */}
          {(role === 'RECRUITER' || role === 'COLLEGE_ADMIN' || role === 'ADMIN') && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Portal Management
              </div>
              <nav className="space-y-1">
                {roleNav[role as keyof typeof roleNav]?.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

        </div>

        {/* Footer PRO Badge Card */}
        <div className="pt-4 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/30 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-colors" />
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">PRO Plan Active</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5">Unlimited AI Mock Interviews & ATS analysis unlocked.</p>
            <NavLink
              to="/pricing"
              className="block w-full text-center py-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-xl transition-all"
            >
              Manage Subscription
            </NavLink>
          </div>
        </div>

      </aside>
    </>
  );
};
