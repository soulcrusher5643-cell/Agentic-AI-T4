import { create } from 'zustand';
import {
  StudentProfile, OpportunityRanking, ApplicationRecord, 
  ApplicationKit, GroqSettings
} from '../types';
import { api } from '../services/api';

interface AppState {
  profile: StudentProfile;
  rankings: OpportunityRanking[];
  applications: ApplicationRecord[];
  activeView: 'dashboard' | 'discovery' | 'kanban' | 'settings' | 'parser';
  selectedJobKit: ApplicationKit | null;
  isKitModalOpen: boolean;
  isLoading: boolean;
  groqSettings: GroqSettings;
  
  // Actions
  setActiveView: (view: 'dashboard' | 'discovery' | 'kanban' | 'settings' | 'parser') => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: StudentProfile) => Promise<void>;
  parseResume: (text: string) => Promise<void>;
  fetchOpportunities: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  updateAppStatus: (id: string, updates: Partial<ApplicationRecord>) => Promise<void>;
  generateKit: (jobId: string) => Promise<void>;
  closeKitModal: () => void;
  updateGroqSettings: (settings: GroqSettings) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: {
    name: "Trimil Triliver John",
    university: "National Institute of Technology",
    major: "Computer Science & Artificial Intelligence",
    graduation_year: 2026,
    gpa: 8.9,
    skills: ["Python", "React", "Node.js", "TensorFlow", "PyTorch", "SQL", "REST APIs", "Git"],
    soft_skills: ["Problem Solving", "Team Leadership", "Communication"],
    target_roles: ["AI Engineer Intern", "Full Stack Intern", "Data Science Intern"],
    preferred_locations: ["Remote", "Bengaluru", "Hybrid"],
    min_stipend: "₹25,000",
    work_authorization: "Authorized to work in India / Remote",
    resume_text: "Final year Computer Science student building autonomous agentic AI systems."
  },
  rankings: [],
  applications: [],
  activeView: 'dashboard',
  selectedJobKit: null,
  isKitModalOpen: false,
  isLoading: false,
  groqSettings: {
    apiKey: '',
    modelName: 'llama-3.3-70b-versatile',
    useMock: false,
  },

  setActiveView: (view) => set({ activeView: view }),

  fetchProfile: async () => {
    try {
      const profile = await api.getProfile();
      set({ profile });
    } catch (e) {
      console.warn("API offline, using fallback state");
    }
  },

  updateProfile: async (profile) => {
    set({ isLoading: true });
    try {
      const updated = await api.updateProfile(profile);
      set({ profile: updated });
      await get().fetchOpportunities();
    } catch (e) {
      set({ profile });
    } finally {
      set({ isLoading: false });
    }
  },

  parseResume: async (text) => {
    set({ isLoading: true });
    try {
      const updated = await api.parseResume(text);
      set({ profile: updated });
      await get().fetchOpportunities();
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOpportunities: async () => {
    set({ isLoading: true });
    try {
      const res = await api.discoverOpportunities(get().profile);
      set({ rankings: res.rankings });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchApplications: async () => {
    try {
      const apps = await api.getApplications();
      set({ applications: apps });
    } catch (e) {
      console.error(e);
    }
  },

  updateAppStatus: async (id, updates) => {
    try {
      const updated = await api.updateApplication(id, updates);
      set((state) => ({
        applications: state.applications.some(a => a.id === id)
          ? state.applications.map(a => a.id === id ? updated : a)
          : [...state.applications, updated]
      }));
    } catch (e) {
      console.error(e);
    }
  },

  generateKit: async (jobId) => {
    set({ isLoading: true });
    try {
      const kit = await api.generateApplicationKit(jobId, get().profile);
      set({ selectedJobKit: kit, isKitModalOpen: true });
    } catch (e) {
      console.error(e);
    } finally {
      set({ isLoading: false });
    }
  },

  closeKitModal: () => set({ isKitModalOpen: false, selectedJobKit: null }),

  updateGroqSettings: async (settings) => {
    set({ groqSettings: settings });
    try {
      await api.updateSettings(settings);
    } catch (e) {
      console.error(e);
    }
  }
}));
