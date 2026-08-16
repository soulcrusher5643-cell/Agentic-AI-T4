import React from 'react';
import { RubricBreakdown } from '../types';

interface MatchBadgeProps {
  score: number;
  rubric?: RubricBreakdown;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ score, rubric, size = 'md' }) => {
  let colorClass = 'border-cyan-400 text-cyan-400 bg-cyan-500/10 shadow-cyan-500/20';
  if (score < 60) {
    colorClass = 'border-amber-400 text-amber-400 bg-amber-500/10 shadow-amber-500/20';
  } else if (score >= 85) {
    colorClass = 'border-emerald-400 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/20';
  }

  const dimensions = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }[size];

  return (
    <div className="group relative inline-block">
      <div
        className={`${dimensions} ${colorClass} rounded-full border-2 font-extrabold font-heading flex flex-col items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105 cursor-pointer`}
      >
        <span>{score}%</span>
      </div>

      {/* Tooltip Rubric Breakdown */}
      {rubric && (
        <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-0 bottom-full mb-2 w-56 p-3 glass-panel rounded-xl shadow-2xl z-50 text-[11px] space-y-1 border border-white/20">
          <div className="font-bold text-slate-200 pb-1 border-b border-white/10 flex justify-between">
            <span>ATS Rubric Score</span>
            <span className="text-cyan-400">{score} / 100</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Core Tech Skills (40%):</span>
            <span className="font-semibold">{rubric.core_tech_score} pts</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Eligibility (30%):</span>
            <span className="font-semibold">{rubric.eligibility_score} pts</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Secondary Tools (20%):</span>
            <span className="font-semibold">{rubric.secondary_skills_score} pts</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Location/Stipend (10%):</span>
            <span className="font-semibold">{rubric.location_score} pts</span>
          </div>
        </div>
      )}
    </div>
  );
};
