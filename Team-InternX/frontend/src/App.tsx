import React from 'react';
import { useAppStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { KanbanBoard } from './components/KanbanBoard';
import { ApplicationModal } from './components/ApplicationModal';
import { SettingsPanel } from './components/SettingsPanel';
import { ResumeParser } from './components/ResumeParser';

export function App() {
  const { activeView } = useAppStore();

  return (
    <div className="flex min-h-screen bg-[#070913]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {activeView === 'dashboard' && <OverviewDashboard />}
          {activeView === 'discovery' && <DiscoveryFeed />}
          {activeView === 'kanban' && <KanbanBoard />}
          {activeView === 'parser' && <ResumeParser />}
          {activeView === 'settings' && <SettingsPanel />}
        </main>
      </div>

      <ApplicationModal />
    </div>
  );
}

export default App;
