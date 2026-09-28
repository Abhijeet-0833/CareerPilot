import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { 
  Search, MapPin, DollarSign, Briefcase, Filter, 
  Bookmark, Target, ArrowRight, Sparkles, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../services/api';

export const JobSearch: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('Java Developer');
  const [location, setLocation] = useState('San Francisco, CA');
  const [workType, setWorkType] = useState('ALL');
  const [savedJobs, setSavedJobs] = useState<Record<number, boolean>>({});

  const sampleJobs = [
    {
      id: 101,
      title: 'Senior Java Backend Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      workType: 'Hybrid',
      salary: '$140,000 - $180,000',
      posted: '2 days ago',
      matchScore: 92,
      skills: ['Java 17', 'Spring Boot 3', 'REST API', 'PostgreSQL', 'Docker'],
      description: 'Architect scalable payment infrastructure REST services handling high throughput with low latency.',
    },
    {
      id: 102,
      title: 'Full Stack Software Engineer',
      company: 'Datadog',
      location: 'Remote',
      workType: 'Remote',
      salary: '$130,000 - $165,000',
      posted: '1 day ago',
      matchScore: 88,
      skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'SQL'],
      description: 'Build end-to-end monitoring metrics dashboards and high-performance microservices.',
    },
    {
      id: 103,
      title: 'Product Backend Engineer',
      company: 'Linear',
      location: 'Remote',
      workType: 'Remote',
      salary: '$150,000 - $190,000',
      posted: '3 days ago',
      matchScore: 85,
      skills: ['Java 17', 'REST API', 'PostgreSQL', 'Microservices', 'Git'],
      description: 'Engineers building fast, delightful project management software.',
    },
    {
      id: 104,
      title: 'Backend Microservices Developer',
      company: 'Cloudflare',
      location: 'Austin, TX',
      workType: 'On-site',
      salary: '$135,000 - $170,000',
      posted: 'Just now',
      matchScore: 84,
      skills: ['Java', 'Spring Security', 'Docker', 'Kafka', 'SQL'],
      description: 'Develop security & networking backend microservices running at scale.',
    },
  ];

  const filteredJobs = sampleJobs.filter(j => {
    if (workType !== 'ALL' && j.workType.toUpperCase() !== workType) return false;
    if (query && !j.title.toLowerCase().includes(query.toLowerCase()) && !j.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  const handleSaveJob = (jobId: number) => {
    setSavedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const handleTrackApplication = async (job: typeof sampleJobs[0]) => {
    await applicationApi.createApplication({
      companyName: job.company,
      jobTitle: job.title,
      location: job.location,
      salaryRange: job.salary,
      status: 'SAVED',
    });
    navigate('/applications');
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Search Bar Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Search className="w-7 h-7 text-indigo-400" />
            Smart Job Discovery Module
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover verified tech openings aligned with your Master Resume & calculate instant match scores.
          </p>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by role or tech skill (e.g., Java, Spring Boot)..."
              className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
            />
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Location or Remote..."
              className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
            />
          </div>
          <select
            value={workType}
            onChange={e => setWorkType(e.target.value)}
            className="glass-input px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 cursor-pointer"
          >
            <option value="ALL">All Work Types</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ON-SITE">On-site</option>
          </select>
        </div>
      </div>

      {/* Job Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredJobs.length} active opportunities</span>
          <span className="text-indigo-400 font-semibold">Matched with Master Resume</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <GlassCard key={job.id} glow="indigo" className="space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">{job.company}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {job.matchScore}% Match
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {job.location} ({job.workType})
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {job.salary}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
                <button
                  onClick={() => handleSaveJob(job.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    savedJobs[job.id]
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{savedJobs[job.id] ? 'Saved' : 'Save Job'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button variant="glass" size="sm" onClick={() => navigate('/jd-analyzer')}>
                    Analyze JD
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleTrackApplication(job)} icon={<ArrowRight className="w-4 h-4" />}>
                    Track Application
                  </Button>
                </div>
              </div>

            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};
