import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { 
  X, Sparkles, Copy, Check, Send, FileText, 
  HelpCircle, Lightbulb, ExternalLink 
} from 'lucide-react';

export const ApplicationModal: React.FC = () => {
  const { selectedJobKit, isKitModalOpen, closeKitModal, updateAppStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<'pitch' | 'cover' | 'bullets' | 'qna'>('pitch');
  const [copied, setCopied] = useState(false);

  if (!isKitModalOpen || !selectedJobKit) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    updateAppStatus(selectedJobKit.job_id, {
      status: 'Applied',
      job_id: selectedJobKit.job_id,
      applied_date: new Date().toISOString().split('T')[0],
      notes: `Applied with AI Tailored Kit. Job: ${selectedJobKit.job_title}`
    });
    closeKitModal();
    alert(`Application sent & moved to "Applied" Kanban column for ${selectedJobKit.company}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {selectedJobKit.job_title}
              </h3>
              <p className="text-xs text-cyan-400 font-medium">
                {selectedJobKit.company} • AI Application Package
              </p>
            </div>
          </div>
          <button 
            onClick={closeKitModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'pitch' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Elevator Pitch
          </button>
          <button
            onClick={() => setActiveTab('cover')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'cover' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Cover Letter
          </button>
          <button
            onClick={() => setActiveTab('bullets')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'bullets' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Resume Bullet Enhancements
          </button>
          <button
            onClick={() => setActiveTab('qna')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'qna' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Interview Q&A Talking Points
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'pitch' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                High-Impact Outreach Elevator Pitch:
              </label>
              <textarea 
                readOnly
                value={selectedJobKit.pitch}
                className="w-full h-40 bg-slate-900/80 border border-white/10 rounded-xl p-4 text-xs text-slate-200 font-body leading-relaxed focus:outline-none"
              />
              <div className="flex justify-end">
                <button 
                  onClick={() => handleCopy(selectedJobKit.pitch)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Pitch'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'cover' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Tailored Professional Cover Letter:
              </label>
              <textarea 
                readOnly
                value={selectedJobKit.cover_letter}
                className="w-full h-64 bg-slate-900/80 border border-white/10 rounded-xl p-4 text-xs text-slate-200 font-body leading-relaxed focus:outline-none"
              />
              <div className="flex justify-end">
                <button 
                  onClick={() => handleCopy(selectedJobKit.cover_letter)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Cover Letter'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bullets' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Action-Oriented Resume Bullets Tailored for {selectedJobKit.company}:
              </label>
              <div className="space-y-2">
                {selectedJobKit.resume_bullet_suggestions.map((bullet, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-200 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'qna' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Strategic Interview Preparation & Talking Points:
              </label>
              <div className="space-y-3">
                {selectedJobKit.interview_prep_qna.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-1.5">
                    <h5 className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-cyan-400" /> {item.question}
                    </h5>
                    <p className="text-xs text-slate-300 pl-5 border-l-2 border-cyan-500/30">
                      💡 {item.answer_tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Gap Advice Box */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h5 className="font-bold text-amber-300">Skill Gap Action Plan</h5>
              <p className="text-slate-300">{selectedJobKit.skill_gap_advice}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={closeKitModal}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300"
          >
            Close Workspace
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" /> Confirm & Mark as Applied
          </button>
        </div>
      </div>
    </div>
  );
};
