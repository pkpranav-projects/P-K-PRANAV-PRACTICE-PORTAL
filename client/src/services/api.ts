import {
  DashboardStats,
  QuestionDetail,
  QuestionSolution,
  QuestionSummary,
  RunResult,
  SubmissionRecord,
  SubmitResult,
  SystemHealth,
  CurriculumItem,
  MasterclassData,
  SupportedLanguage
} from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth(): Promise<SystemHealth> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  async getQuestions(params?: {
    topic?: string;
    difficulty?: string;
    status?: string;
    search?: string;
    sort?: string;
    bank?: string;
  }): Promise<QuestionSummary[]> {
    const query = new URLSearchParams();
    if (params?.bank && params.bank !== 'all') query.set('bank', params.bank);
    if (params?.topic && params.topic !== 'All') query.set('topic', params.topic);
    if (params?.difficulty && params.difficulty !== 'All') query.set('difficulty', params.difficulty);
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);

    const res = await fetch(`${API_BASE}/questions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch questions');
    return res.json();
  },

  async getQuestion(id: string): Promise<QuestionDetail> {
    const res = await fetch(`${API_BASE}/questions/${id}`);
    if (!res.ok) throw new Error(`Question ${id} not found`);
    return res.json();
  },

  async getSolution(id: string): Promise<QuestionSolution> {
    const res = await fetch(`${API_BASE}/questions/${id}/solution`);
    if (!res.ok) throw new Error(`Solution for ${id} not found`);
    return res.json();
  },

  async saveDraft(id: string, code: string, language: SupportedLanguage = 'java'): Promise<{ success: boolean; updatedAt: string }> {
    const res = await fetch(`${API_BASE}/drafts/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    });
    if (!res.ok) throw new Error('Failed to save draft');
    return res.json();
  },

  async getDraft(id: string, language: SupportedLanguage = 'java'): Promise<{ draftCode: string | null; updatedAt: string | null }> {
    const res = await fetch(`${API_BASE}/drafts/${id}?language=${language}`);
    if (!res.ok) throw new Error('Failed to get draft');
    return res.json();
  },

  async toggleBookmark(id: string): Promise<{ success: boolean; isBookmarked: boolean }> {
    const res = await fetch(`${API_BASE}/bookmarks/${id}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  async toggleRevision(id: string, reason?: string): Promise<{ success: boolean; isRevision: boolean }> {
    const res = await fetch(`${API_BASE}/revision/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to toggle revision');
    return res.json();
  },

  async runCode(code: string, input?: string, language: SupportedLanguage = 'java', questionId?: string): Promise<RunResult> {
    const res = await fetch(`${API_BASE}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, input, language, questionId })
    });
    return res.json();
  },

  async submitCode(questionId: string, code: string, language: SupportedLanguage = 'java'): Promise<SubmitResult> {
    const res = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, code, language })
    });
    return res.json();
  },

  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  async getSubmissions(questionId?: string, limit: number = 30): Promise<SubmissionRecord[]> {
    const query = new URLSearchParams();
    if (questionId) query.set('questionId', questionId);
    if (limit) query.set('limit', limit.toString());

    const res = await fetch(`${API_BASE}/submissions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return res.json();
  },

  async getSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSetting(key: string, value: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) throw new Error('Failed to update setting');
    return res.json();
  },

  async exportBackup(): Promise<any> {
    const res = await fetch(`${API_BASE}/export`);
    if (!res.ok) throw new Error('Failed to export backup');
    return res.json();
  },

  async importBackup(data: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to import backup');
    }
    return res.json();
  },

  async resetProgress(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset progress');
    return res.json();
  },

  async getCurriculum(): Promise<CurriculumItem[]> {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch study curriculum');
    return res.json();
  },

  async openDocument(filename: string, app: 'edge' | 'system' = 'edge'): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/documents/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, app })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to open local document');
    }
    return res.json();
  },

  async getMasterclass(): Promise<MasterclassData> {
    const res = await fetch(`${API_BASE}/masterclass`);
    if (!res.ok) throw new Error('Failed to fetch masterclass curriculum');
    return res.json();
  }
};
