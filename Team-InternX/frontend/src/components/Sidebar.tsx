import React from 'react';
import { useAppStore } from '../store/useStore';
import { 
  LayoutDashboard, Compass, Kanban, Settings, FileText, 
  Bot, ShieldCheck, Sparkles 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'discovery', label: 'AI Discovery Feed', icon: Compass },
    { id: 'kanban', label: 'Kanban Application Tracker', icon: Kanban },
    { id: 'parser', label: 'Resume AI Parser', icon: FileText },
    { id: 'settings', label: 'Groq Agent Config', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 glass-panel border-r border-white/10 flex flex-col justify-between p-4 min-h-screen">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl tracking-tight text-white">
              Intern<span className="text-cyan-400">X</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
              Autonomous AI Agent
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Agent Status Badge */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Groq LLaMA-3.3
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-[11px] text-slate-400">
          Agent engine active with 40/30/20/10 ATS rubric evaluator.
        </p>
        <button 
          onClick={() => setActiveView('settings')}
          className="w-full py-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded flex items-center justify-center gap-1 transition"
        >
          <Sparkles className="w-3 h-3" /> Config Agent API
        </button>
      </div>
    </aside>
  );
};
