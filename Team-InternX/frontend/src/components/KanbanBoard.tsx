import React, { useEffect } from 'react';
import { useAppStore } from '../store/useStore';
import { 
  Bookmark, Paperplane, MessageSquare, Award, XCircle, 
  Plus, Calendar, Clock, Edit2 
} from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const { applications, rankings, fetchApplications, updateAppStatus } = useAppStore();

  useEffect(() => {
    fetchApplications();
  }, []);

  const columns: { id: 'Saved' | 'Applied' | 'Interviewing' | 'Offered' | 'Rejected'; title: string; color: string }[] = [
    { id: 'Saved', title: 'Saved / Bookmarked', color: 'border-slate-500 text-slate-300' },
    { id: 'Applied', title: 'Applied', color: 'border-indigo-400 text-indigo-300' },
    { id: 'Interviewing', title: 'Interviewing', color: 'border-cyan-400 text-cyan-300' },
    { id: 'Offered', title: 'Offer Secured', color: 'border-emerald-400 text-emerald-300' },
    { id: 'Rejected', title: 'Archived / Closed', color: 'border-red-400 text-red-300' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-heading font-bold text-lg text-white">Application Pipeline Board</h3>
          <p className="text-xs text-slate-400">Track and advance your target internship applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colItems = applications.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              className="glass-panel p-3.5 rounded-2xl border border-white/10 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between pb-3 mb-3 border-b border-white/10 ${col.color}`}>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider">
                  {col.title}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                  {colItems.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {colItems.map((app) => {
                  const ranking = rankings.find((r) => r.opportunity.id === app.job_id);
                  const job = ranking?.opportunity;
                  return (
                    <div
                      key={app.id}
                      className="glass-panel glass-panel-hover p-3.5 rounded-xl border border-white/10 space-y-2 text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide block">
                          {job?.company || 'Company'}
                        </span>
                        <h5 className="font-heading font-bold text-sm text-white">
                          {job?.title || `Job #${app.job_id}`}
                        </h5>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        {app.applied_date && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>Applied: {app.applied_date}</span>
                          </div>
                        )}
                        {app.reminder_date && (
                          <div className="flex items-center gap-1.5 text-amber-300">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Interview: {app.reminder_date}</span>
                          </div>
                        )}
                      </div>

                      {app.notes && (
                        <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded border border-white/5">
                          "{app.notes}"
                        </p>
                      )}

                      {/* Status Transition Selector */}
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                        <select
                          value={app.status}
                          onChange={(e) => updateAppStatus(app.id, { status: e.target.value as any })}
                          className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-[10px] font-semibold text-slate-200 focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Saved">Saved</option>
                          <option value="Applied">Applied</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Offered">Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  );
                })}

                {colItems.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-[11px] text-slate-500 font-medium">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
