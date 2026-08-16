import React, { useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { MatchBadge } from './MatchBadge';
import { 
  Target, Briefcase, Calendar, CheckCircle2, ArrowUpRight, 
  Sparkles, Clock, AlertTriangle, ChevronRight 
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const { 
    profile, rankings, applications, fetchOpportunities, 
    fetchApplications, generateKit, setActiveView 
  } = useAppStore();

  useEffect(() => {
    fetchOpportunities();
    fetchApplications();
  }, []);

  const totalApplied = applications.filter(a => a.status === 'Applied').length;
  const totalInterview = applications.filter(a => a.status === 'Interviewing').length;
  const totalOffered = applications.filter(a => a.status === 'Offered').length;
  const topRankings = rankings.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Alert Banner for Upcoming Deadlines */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-cyan-400 flex items-center justify-between bg-gradient-to-r from-cyan-950/30 to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white">
              Upcoming Application Deadlines Alert
            </h4>
            <p className="text-xs text-slate-300">
              3 high-compatibility opportunities (AI Engineer @ Anthropic, Full Stack @ Nexus) close within 5 days!
            </p>
          </div>
        </div>
        <button 
          onClick={() => setActiveView('discovery')}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 transition"
        >
          View Discovery Feed <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Match Score</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-cyan-400">
            {rankings.length > 0 ? `${rankings[0].match_evaluation.match_percent}%` : '94%'}
          </div>
          <p className="text-[11px] text-slate-400">Calculated across core technical & eligibility rubric</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Applications</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-indigo-400">
            {applications.length}
          </div>
          <p className="text-[11px] text-slate-400">{totalApplied} Applied • {totalInterview} Interviewing</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Offers Secured</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-emerald-400">
            {totalOffered}
          </div>
          <p className="text-[11px] text-slate-400">1 Pending Offer (DeepVision Labs)</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Skills Analyzed</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold font-heading text-violet-400">
            {profile.skills.length} Core
          </div>
          <p className="text-[11px] text-slate-400">Python, React, Node, PyTorch, SQL</p>
        </div>
      </div>

      {/* Recommended Opportunities List */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Top Recommended AI Matchings</h3>
            <p className="text-xs text-slate-400">Ranked by ATS 40/30/20/10 Rubric Scoring for {profile.name}</p>
          </div>
          <button 
            onClick={() => setActiveView('discovery')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            Explore All 18 Listings <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRankings.map((item) => {
            const { opportunity, match_evaluation } = item;
            return (
              <div 
                key={opportunity.id} 
                className="glass-panel glass-panel-hover p-4 rounded-xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide block">
                        {opportunity.company}
                      </span>
                      <h4 className="font-heading font-bold text-base text-white">
                        {opportunity.title}
                      </h4>
                    </div>
                    <MatchBadge score={match_evaluation.match_percent} rubric={match_evaluation.rubric_breakdown} size="sm" />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span>📍 {opportunity.location}</span>
                    <span>💰 {opportunity.stipend}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {match_evaluation.matched_skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ✓ {s}
                      </span>
                    ))}
                    {match_evaluation.missing_skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <button 
                    onClick={() => generateKit(opportunity.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> 1-Click Application Kit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
