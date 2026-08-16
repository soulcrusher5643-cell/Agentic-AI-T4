import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { MatchBadge } from './MatchBadge';
import { Sparkles, Search, Filter, MapPin, DollarSign, Calendar, ExternalLink } from 'lucide-react';

export const DiscoveryFeed: React.FC = () => {
  const { rankings, generateKit, updateAppStatus } = useAppStore();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);

  const domains = ['all', 'AI/ML', 'Full Stack', 'Data Science', 'UI/UX', 'Cyber Security', 'Product'];

  const filteredRankings = rankings.filter(({ opportunity }) => {
    const matchesDomain = selectedDomain === 'all' || opportunity.domain === selectedDomain;
    const matchesSearch = 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.required_skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRemote = !remoteOnly || opportunity.location.toLowerCase().includes('remote');
    return matchesDomain && matchesSearch && matchesRemote;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDomain === domain
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {domain === 'all' ? 'All Domains' : domain}
            </button>
          ))}
        </div>

        {/* Remote Checkbox & Search */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={remoteOnly} 
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            Remote Only
          </label>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, skill..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Grid of Internship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRankings.map(({ opportunity, match_evaluation }) => (
          <div
            key={opportunity.id}
            className="glass-panel glass-panel-hover p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider block">
                    {opportunity.company}
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white leading-snug">
                    {opportunity.title}
                  </h3>
                </div>
                <MatchBadge score={match_evaluation.match_percent} rubric={match_evaluation.rubric_breakdown} size="md" />
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">{opportunity.stipend}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Closes: {opportunity.deadline}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                {opportunity.description}
              </p>

              {/* Skills Tags */}
              <div className="space-y-1.5 mb-5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">ATS Skill Compatibility:</span>
                <div className="flex flex-wrap gap-1.5">
                  {match_evaluation.matched_skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ✓ {skill}
                    </span>
                  ))}
                  {match_evaluation.missing_skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex gap-2">
              <button
                onClick={() => generateKit(opportunity.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
              >
                <Sparkles className="w-4 h-4" /> 1-Click Application Kit
              </button>
              <button
                onClick={() => updateAppStatus(opportunity.id, { status: 'Saved', job_id: opportunity.id })}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
