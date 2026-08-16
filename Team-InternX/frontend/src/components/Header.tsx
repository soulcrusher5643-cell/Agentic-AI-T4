import React from 'react';
import { useAppStore } from '../store/useStore';
import { Bell, Sparkles, UserCheck, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const { profile, activeView } = useAppStore();

  const titleMap = {
    dashboard: 'Overview Dashboard',
    discovery: 'AI Opportunity Discovery Feed',
    kanban: 'Application Pipeline Kanban',
    parser: 'Resume AI Extraction Tool',
    settings: 'Groq Agent & API Settings',
  };

  return (
    <header className="glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="font-heading font-bold text-xl text-white">
          {titleMap[activeView]}
        </h2>
        <p className="text-xs text-slate-400">
          Personalized AI agent managing career discovery and application workflows.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search roles, skills..."
            className="bg-slate-900/60 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Profile Info Badge */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            {profile.name.charAt(0)}
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold text-slate-200 block">{profile.name}</span>
            <span className="text-[10px] text-cyan-400 block">{profile.major.split('&')[0]} • GPA {profile.gpa}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
