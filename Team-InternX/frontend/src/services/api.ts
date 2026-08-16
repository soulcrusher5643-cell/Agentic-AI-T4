import {
  StudentProfile, InternshipOpportunity, MatchEvaluation,
  ApplicationKit, ApplicationRecord, OpportunityRanking, GroqSettings
} from '../types';

const API_BASE = '/api';

export const api = {
  // Profile & Onboarding
  async getProfile(): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(profile: StudentProfile): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async parseResume(resumeText: string): Promise<StudentProfile> {
    const res = await fetch(`${API_BASE}/profile/parse-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: resumeText }),
    });
    if (!res.ok) throw new Error('Failed to parse resume');
    return res.json();
  },

  // Agent Workflows
  async discoverOpportunities(profile?: StudentProfile): Promise<{ total_opportunities: number; rankings: OpportunityRanking[] }> {
    const res = await fetch(`${API_BASE}/agent/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile || null),
    });
    if (!res.ok) throw new Error('Failed to discover opportunities');
    return res.json();
  },

  async evaluateMatch(jobId: string, profile?: StudentProfile): Promise<MatchEvaluation> {
    const res = await fetch(`${API_BASE}/agent/evaluate-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, profile }),
    });
    if (!res.ok) throw new Error('Failed to evaluate match');
    return res.json();
  },

  async generateApplicationKit(jobId: string, profile?: StudentProfile): Promise<ApplicationKit> {
    const res = await fetch(`${API_BASE}/agent/generate-kit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId, profile }),
    });
    if (!res.ok) throw new Error('Failed to generate application kit');
    return res.json();
  },

  // Kanban Application Tracker
  async getApplications(): Promise<ApplicationRecord[]> {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async updateApplication(id: string, updates: Partial<ApplicationRecord>): Promise<ApplicationRecord> {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update application status');
    return res.json();
  },

  // Settings
  async updateSettings(settings: GroqSettings): Promise<void> {
    await fetch(`${API_BASE}/settings/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: settings.apiKey,
        model_name: settings.modelName,
        use_mock: settings.useMock,
      }),
    });
  }
};
