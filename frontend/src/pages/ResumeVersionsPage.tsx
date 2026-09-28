import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import { 
  FileText, Copy, Trash2, Download, Eye, Layers, 
  History, Sparkles, Plus, CheckCircle2 
} from 'lucide-react';
import { resumeApi } from '../services/api';
import { ResumeVersionDTO, ResumeAnalysisHistoryDTO } from '../types';
import { downloadResumeFile } from '../utils/resumeExporter';

export const ResumeVersionsPage: React.FC = () => {
  const [versions, setVersions] = useState<ResumeVersionDTO[]>([]);
  const [history, setHistory] = useState<ResumeAnalysisHistoryDTO[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersionDTO | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const v = await resumeApi.getVersions();
    setVersions(v);
    const h = await resumeApi.getAnalysisHistory();
    setHistory(h);
  };

  const handleDuplicate = async (ver: ResumeVersionDTO) => {
    const dup = await resumeApi.createVersion(
      `${ver.versionName} (Copy)`,
      ver.targetRole,
      ver.companyName,
      ver.tailoredText || ''
    );
    setVersions(prev => [dup, ...prev]);
  };

  const handleDelete = async (id: number) => {
    await resumeApi.deleteVersion(id);
    setVersions(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Layers className="w-7 h-7 text-indigo-400" />
            Resume Version Control & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain Master Resume alongside company-specific tailored versions with full audit history.
          </p>
        </div>
      </div>

      {/* Version Control Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Saved Resume Versions ({versions.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {versions.map(ver => (
            <GlassCard key={ver.id} glow="indigo" className="space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">{ver.versionName}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{ver.companyName} • {ver.targetRole}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {ver.optimizedAtsScore} ATS Score
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>Template: <strong className="text-slate-200">{ver.templateName}</strong></span>
                  <span>Created: {ver.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => {
                      setSelectedVersion(ver);
                      setIsPreviewOpen(true);
                    }}
                    icon={<Eye className="w-4 h-4" />}
                  >
                    View
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    onClick={() => downloadResumeFile(ver.versionName, ver.tailoredText || '', 'PDF')}
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicate(ver)} icon={<Copy className="w-4 h-4" />}>
                    Duplicate
                  </Button>
                </div>

                <Button variant="danger" size="sm" onClick={() => handleDelete(ver.id)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Analysis History Log */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          ATS Score Analysis History Audit
        </h2>

        <GlassCard className="space-y-3">
          <div className="divide-y divide-white/10 text-xs">
            {history.map(item => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{item.targetJobTitle} ({item.companyName})</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.createdAt}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-400">Before: <strong className="text-rose-400">{item.beforeAtsScore}</strong></span>
                  <span className="text-slate-400">After: <strong className="text-emerald-400">{item.afterAtsScore}</strong></span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 text-[11px]">
                    +{item.scoreImprovement} ATS Lift
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Preview Modal */}
      {selectedVersion && (
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={selectedVersion.versionName} maxWidth="xl">
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-white/10">
              <div>
                <p className="font-bold text-white">{selectedVersion.companyName} — {selectedVersion.targetRole}</p>
                <p className="text-slate-400 text-[11px]">Template: {selectedVersion.templateName}</p>
              </div>
              <span className="text-emerald-400 font-extrabold text-sm">{selectedVersion.optimizedAtsScore} ATS Score</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 font-sans leading-relaxed text-slate-300 max-h-96 overflow-y-auto custom-scrollbar">
              {selectedVersion.tailoredText}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsPreviewOpen(false)}>Close</Button>
              <Button 
                variant="gradient" 
                size="sm" 
                onClick={() => downloadResumeFile(selectedVersion.versionName, selectedVersion.tailoredText || '', 'PDF')}
                icon={<Download className="w-4 h-4" />}
              >
                Download PDF
              </Button>
              <Button 
                variant="glass" 
                size="sm" 
                onClick={() => downloadResumeFile(selectedVersion.versionName, selectedVersion.tailoredText || '', 'DOCX')}
                icon={<FileText className="w-4 h-4" />}
              >
                Download DOCX
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
