import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { FileText, Sparkles, Upload, CheckCircle2, UserCheck } from 'lucide-react';

export const ResumeParser: React.FC = () => {
  const { profile, parseResume, updateProfile } = useAppStore();
  const [resumeInput, setResumeInput] = useState(profile.resume_text);
  const [parsedDone, setParsedDone] = useState(false);

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeInput.trim()) return;
    await parseResume(resumeInput);
    setParsedDone(true);
    setTimeout(() => setParsedDone(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white shadow-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">AI Resume & Profile Extraction Tool</h3>
            <p className="text-xs text-slate-400">Paste your resume text to extract skills, degree details, and profile data automatically</p>
          </div>
        </div>

        <form onSubmit={handleParse} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Paste Resume / Profile Summary Text:
            </label>
            <textarea
              rows={8}
              value={resumeInput}
              onChange={(e) => setResumeInput(e.target.value)}
              placeholder="Paste raw resume content, past experience, projects, or degree summary..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl p-4 text-xs text-slate-200 font-body leading-relaxed focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
          >
            {parsedDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
            {parsedDone ? 'Profile Updated & Re-Scored!' : 'Extract Profile & Re-Rank Opportunities'}
          </button>
        </form>

        {/* Current Extracted Profile Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3 text-xs">
          <h4 className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-white/10 pb-2">
            <UserCheck className="w-4 h-4 text-cyan-400" /> Extracted Student Profile
          </h4>
          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>University:</strong> {profile.university}</div>
            <div><strong>Major:</strong> {profile.major}</div>
            <div><strong>GPA:</strong> {profile.gpa} / 10</div>
          </div>

          <div>
            <strong className="text-slate-400 block mb-1">Extracted Technical Skills:</strong>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
