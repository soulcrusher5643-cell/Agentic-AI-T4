import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { Settings, Key, Cpu, ToggleLeft, ToggleRight, Check, Save } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { groqSettings, updateGroqSettings } = useAppStore();
  const [apiKey, setApiKey] = useState(groqSettings.apiKey);
  const [modelName, setModelName] = useState(groqSettings.modelName);
  const [useMock, setUseMock] = useState(groqSettings.useMock);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGroqSettings({ apiKey, modelName, useMock });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Groq LLM Engine Settings</h3>
            <p className="text-xs text-slate-400">Configure Groq API credentials, model parameters, and fallback modes</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-400" /> Groq API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
            <p className="text-[11px] text-slate-400">
              Leave blank to use environment default or built-in deterministic agent fallback.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" /> Groq Model Name
            </label>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (Fast Reasoning)</option>
              <option value="llama3-70b-8192">llama3-70b-8192</option>
            </select>
          </div>

          {/* Toggle Mock Mode */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-xs text-white">Enable Offline Mock Mode</h5>
              <p className="text-[11px] text-slate-400">Use instant pre-calculated agent responses without API calls</p>
            </div>
            <button
              type="button"
              onClick={() => setUseMock(!useMock)}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              {useMock ? <ToggleRight className="w-8 h-8 text-cyan-400" /> : <ToggleLeft className="w-8 h-8 text-slate-500" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {saved ? 'Settings Saved Successfully!' : 'Save Engine Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};
