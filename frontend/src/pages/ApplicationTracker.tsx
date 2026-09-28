import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import { 
  Kanban, Plus, Calendar, UserCheck, DollarSign, 
  MapPin, CheckCircle2, ChevronRight, Award, Trash2 
} from 'lucide-react';
import { applicationApi } from '../services/api';
import { ApplicationItem, ApplicationStatus } from '../types';

export const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const columns: { status: ApplicationStatus; label: string; color: string }[] = [
    { status: 'SAVED', label: 'Saved Jobs', color: 'border-slate-500/40 text-slate-300' },
    { status: 'APPLIED', label: 'Applied', color: 'border-indigo-500/40 text-indigo-400' },
    { status: 'ASSESSMENT', label: 'Assessment', color: 'border-cyan-500/40 text-cyan-400' },
    { status: 'INTERVIEW', label: 'Interviewing', color: 'border-amber-500/40 text-amber-400' },
    { status: 'HR', label: 'HR Round', color: 'border-purple-500/40 text-purple-400' },
    { status: 'OFFER', label: 'Offer Received', color: 'border-emerald-500/40 text-emerald-400' },
    { status: 'REJECTED', label: 'Archived', color: 'border-rose-500/40 text-rose-400' },
  ];

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const data = await applicationApi.getApplications();
    setApplications(data);
  };

  const handleStatusChange = async (appId: number, nextStatus: ApplicationStatus) => {
    if (nextStatus === 'OFFER') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: nextStatus } : app))
    );
    await applicationApi.updateStatus(appId, nextStatus);
  };

  const handleAddApplication = async () => {
    if (!newCompany || !newRole) return;

    const created = await applicationApi.createApplication({
      companyName: newCompany,
      jobTitle: newRole,
      location: newLocation || 'Remote',
      salaryRange: newSalary || '$130,000 - $160,000',
      status: 'SAVED',
      notes: newNotes,
    });

    setApplications(prev => [...prev, created]);
    setNewCompany('');
    setNewRole('');
    setNewLocation('');
    setNewSalary('');
    setNewNotes('');
    setIsModalOpen(false);
  };

  const totalApps = applications.length;
  const interviewsCount = applications.filter(a => a.status === 'INTERVIEW' || a.status === 'HR').length;
  const offersCount = applications.filter(a => a.status === 'OFFER').length;
  const responseRate = totalApps > 0 ? Math.round(((interviewsCount + offersCount) / totalApps) * 100) : 0;

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Kanban className="w-7 h-7 text-indigo-400" />
            Kanban Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track job applications from Saved to Offer with follow-up dates & metrics.
          </p>
        </div>

        <Button variant="gradient" size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Track New Application
        </Button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tracked" value={totalApps} subtitle="Pipeline applications" glow="indigo" />
        <StatCard title="Active Interviews" value={interviewsCount} subtitle="HR & Tech rounds scheduled" glow="purple" />
        <StatCard title="Job Offers" value={offersCount} subtitle="Offers received" glow="emerald" />
        <StatCard title="Response Rate" value={`${responseRate}%`} subtitle="Interview conversion" glow="cyan" />
      </div>

      {/* Kanban Columns Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar min-h-[600px]">
        {columns.map(col => {
          const colApps = applications.filter(a => a.status === col.status);
          return (
            <div key={col.status} className="w-72 shrink-0 flex flex-col space-y-3">
              
              {/* Column Header */}
              <div className={`p-3 rounded-2xl glass-panel border ${col.color} flex items-center justify-between`}>
                <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                  {colApps.length}
                </span>
              </div>

              {/* Column App Cards */}
              <div className="space-y-3 flex-1">
                {colApps.map(app => (
                  <GlassCard key={app.id} className="p-4 space-y-3 text-xs relative group">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{app.jobTitle}</h4>
                        <p className="font-semibold text-indigo-400">{app.companyName}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400">
                      {app.location && <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {app.location}</p>}
                      {app.salaryRange && <p className="flex items-center gap-1"><DollarSign className="w-3 h-3 text-emerald-400" /> {app.salaryRange}</p>}
                      {app.appliedDate && <p className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-500" /> Applied: {app.appliedDate}</p>}
                      {app.followUpDate && <p className="flex items-center gap-1 text-amber-400 font-medium"><Calendar className="w-3 h-3" /> Follow up: {app.followUpDate}</p>}
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-white/5">
                        "{app.notes}"
                      </p>
                    )}

                    {/* Stage Selector */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Move to:</span>
                      <select
                        value={app.status}
                        onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="glass-input text-[10px] px-2 py-1 rounded-lg bg-slate-900 cursor-pointer"
                      >
                        {columns.map(c => (
                          <option key={c.status} value={c.status}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                  </GlassCard>
                ))}

                {colApps.length === 0 && (
                  <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-xs text-slate-500">
                    No items in {col.label}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Track New Application */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Track New Job Application">
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 uppercase">Company Name</label>
            <input
              type="text"
              value={newCompany}
              onChange={e => setNewCompany(e.target.value)}
              placeholder="e.g. Stripe, Datadog..."
              className="w-full glass-input px-3.5 py-2 rounded-xl mt-1"
            />
          </div>

          <div>
            <label className="font-bold text-slate-400 uppercase">Job Title</label>
            <input
              type="text"
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
              placeholder="e.g. Senior Java Backend Engineer..."
              className="w-full glass-input px-3.5 py-2 rounded-xl mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-400 uppercase">Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                placeholder="e.g. San Francisco or Remote"
                className="w-full glass-input px-3.5 py-2 rounded-xl mt-1"
              />
            </div>
            <div>
              <label className="font-bold text-slate-400 uppercase">Salary Range</label>
              <input
                type="text"
                value={newSalary}
                onChange={e => setNewSalary(e.target.value)}
                placeholder="e.g. $140k - $175k"
                className="w-full glass-input px-3.5 py-2 rounded-xl mt-1"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-400 uppercase">Application Notes</label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="Notes about interview prep or contact recruiter..."
              className="w-full glass-input p-3 rounded-xl mt-1 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleAddApplication}>Save to Kanban</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
