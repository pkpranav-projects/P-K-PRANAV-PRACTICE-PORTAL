import React, { useState, useEffect, useCallback } from 'react';
import { Minimize2 } from 'lucide-react';
import { LeetCodeNavbar, LeetCodeTab } from './components/LeetCodeNavbar';
import { LeetCodeSidebar } from './components/LeetCodeSidebar';
import { ExploreView } from './components/ExploreView';
import { QuestionBankView } from './components/QuestionBankView';
import { ProblemWorkspaceView } from './components/ProblemWorkspaceView';
import { CurriculumView } from './components/CurriculumView';
import { MasterclassView } from './components/MasterclassView';
import { ExamModeView } from './components/ExamModeView';
import { DashboardView } from './components/DashboardView';
import { SettingsModal } from './components/SettingsModal';
import { api } from './services/api';
import { DashboardStats, QuestionSummary, SystemHealth } from './types';

export const App: React.FC = () => {
  // LeetCode default landing page is 'explore'
  const [activeTab, setActiveTab] = useState<LeetCodeTab>('explore');
  const [activeQuestionId, setActiveQuestionId] = useState<string>('java-001');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarFullyContracted, setIsSidebarFullyContracted] = useState(false);
  const [isAbsoluteFullscreen, setIsAbsoluteFullscreen] = useState(false);
  const [selectedBankFilter, setSelectedBankFilter] = useState<'bank1' | 'bank2' | 'all'>('all');

  const [theme, setTheme] = useState<'dark' | 'oled' | 'light' | 'system'>(() => {
    return (localStorage.getItem('arena_theme') as any) || 'dark';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    localStorage.setItem('arena_theme', theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'oled', 'light');

    const isOled = theme === 'oled';
    const isDark =
      theme === 'dark' ||
      isOled ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      if (isOled) {
        root.classList.add('oled');
      }
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Listen to system theme change if 'system' selected
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove('dark', 'oled', 'light');
      if (mq.matches) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.add('light');
        root.style.colorScheme = 'light';
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [theme]);

  // Absolute Fullscreen toggle: requests native HTML5 fullscreen and contracts sidebar fully
  const toggleAbsoluteFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement as any;
      const req =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;

      if (req) {
        req.call(docEl).catch((err: any) => {
          console.warn('Native fullscreen request error:', err);
        });
      }
      setIsAbsoluteFullscreen(true);
      setIsSidebarFullyContracted(true);
    } else {
      const doc = document as any;
      const exit =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;

      if (exit) {
        exit.call(doc).catch((err: any) => {
          console.warn('Exit fullscreen error:', err);
        });
      }
      setIsAbsoluteFullscreen(false);
      setIsSidebarFullyContracted(false);
    }
  }, []);

  // Listen to native browser fullscreen change (e.g. Esc key or F11)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsAbsoluteFullscreen(isFull);
      if (isFull) {
        setIsSidebarFullyContracted(true);
      } else {
        setIsSidebarFullyContracted(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcut: Alt+Enter to toggle absolute fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        toggleAbsoluteFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleAbsoluteFullscreen]);

  // Load initial application data
  const loadInitialData = useCallback(async () => {
    try {
      const [healthData, statsData, questionsData] = await Promise.all([
        api.getHealth(),
        api.getStats(),
        api.getQuestions()
      ]);
      setSystemHealth(healthData);
      setStats(statsData);
      setQuestions(questionsData);
    } catch (err) {
      console.error('Failed to load arena data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Refresh stats after actions
  const refreshStats = async () => {
    try {
      const [newStats, newQuestions] = await Promise.all([
        api.getStats(),
        api.getQuestions()
      ]);
      setStats(newStats);
      setQuestions(newQuestions);
    } catch (err) {
      console.error('Stats refresh failed:', err);
    }
  };

  // Select question and open workspace
  const handleSelectQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    setActiveTab('workspace');
  };

  // Pick a random question
  const handlePickRandom = () => {
    if (questions.length === 0) return;
    const unsolved = questions.filter((q) => !q.solved);
    const pool = unsolved.length > 0 ? unsolved : questions;
    const randomQ = pool[Math.floor(Math.random() * pool.length)];
    handleSelectQuestion(randomQ.id);
  };

  // Toggle bookmark
  const handleToggleBookmark = async (id: string) => {
    await api.toggleBookmark(id);
    refreshStats();
  };

  // Toggle revision
  const handleToggleRevision = async (id: string) => {
    await api.toggleRevision(id);
    refreshStats();
  };

  const allQuestionIds = questions.map((q) => q.id);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6bf] flex flex-col select-none transition-colors duration-200">
      {/* Authentic LeetCode Top Navigation Bar (Fixed 50px) */}
      <LeetCodeNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dailyGoal={stats?.dailyGoal || 3}
        solvedToday={stats?.solvedToday || 0}
        totalSolved={stats?.solvedCount || 0}
        totalQuestions={stats?.totalQuestions || 45}
        systemHealth={systemHealth}
        theme={theme}
        setTheme={setTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPickRandom={handlePickRandom}
        activeQuestionId={activeQuestionId}
        isAbsoluteFullscreen={isAbsoluteFullscreen}
        onToggleAbsoluteFullscreen={toggleAbsoluteFullscreen}
      />

      {/* Main Page Layout: Left Docked LeetCode Sidebar + Content */}
      <div className="flex w-full flex-1">
        {/* LeetCode Docked Left Sidebar */}
        {activeTab !== 'workspace' && (
          <LeetCodeSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
            isFullyContracted={isSidebarFullyContracted}
            onToggleFullContract={() => setIsSidebarFullyContracted((prev) => !prev)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSelectBank={(bank) => {
              setSelectedBankFilter(bank);
              setActiveTab('problems');
            }}
            totalQuestions={stats?.totalQuestions || 45}
            totalSolved={stats?.solvedCount || 0}
            bank1Solved={stats?.bank1Solved || 0}
            bank1Total={stats?.bank1Total || 30}
            bank2Solved={stats?.bank2Solved || 0}
            bank2Total={stats?.bank2Total || 15}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-x-hidden min-h-[calc(100vh-50px)] transition-all duration-300 ${
            isAbsoluteFullscreen || isSidebarFullyContracted
              ? 'p-4 lg:p-6 w-full max-w-none'
              : 'p-6 lg:p-8 max-w-[1600px]'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-neutral-400">
                Loading LeetCode Explore...
              </p>
            </div>
          ) : (
            <>
              {/* LeetCode Explore Page (Authentic Featured, Interview, Learn sections) */}
              {activeTab === 'explore' && (
                <ExploreView
                  stats={stats}
                  questions={questions}
                  onSelectQuestion={handleSelectQuestion}
                  onNavigateToBank={(bank) => {
                    setSelectedBankFilter(bank);
                    setActiveTab('problems');
                  }}
                  onNavigateToMasterclass={() => setActiveTab('masterclass')}
                  onNavigateToCurriculum={() => setActiveTab('curriculum')}
                  onNavigateToExam={() => setActiveTab('exam')}
                  onPickRandom={handlePickRandom}
                />
              )}

              {/* LeetCode Problem Set View */}
              {activeTab === 'problems' && (
                <QuestionBankView
                  questions={questions}
                  onSelectQuestion={handleSelectQuestion}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleRevision={handleToggleRevision}
                  initialFilterStatus="All"
                  initialBank={selectedBankFilter}
                  onPickRandom={handlePickRandom}
                />
              )}

              {/* LeetCode Code Workspace (Monaco Editor & Runner) */}
              {activeTab === 'workspace' && (
                <ProblemWorkspaceView
                  questionId={activeQuestionId}
                  theme={theme}
                  onNavigateQuestion={handleSelectQuestion}
                  onQuestionSolved={refreshStats}
                  allQuestionIds={allQuestionIds}
                  isAbsoluteFullscreen={isAbsoluteFullscreen}
                  onToggleAbsoluteFullscreen={toggleAbsoluteFullscreen}
                />
              )}

              {/* Java Masterclass & A-Z Reference */}
              {activeTab === 'masterclass' && (
                <MasterclassView
                  onSelectQuestion={handleSelectQuestion}
                  onNavigateToBank={(bank) => {
                    setSelectedBankFilter(bank);
                    setActiveTab('problems');
                  }}
                />
              )}

              {/* 27 Study Guides Curriculum */}
              {activeTab === 'curriculum' && (
                <CurriculumView
                  onSelectQuestion={handleSelectQuestion}
                />
              )}

              {/* Timed Exam Simulator */}
              {activeTab === 'exam' && (
                <ExamModeView
                  questions={questions}
                  onOpenWorkspaceQuestion={handleSelectQuestion}
                />
              )}

              {/* Revision Queue */}
              {activeTab === 'revision' && (
                <QuestionBankView
                  questions={questions}
                  onSelectQuestion={handleSelectQuestion}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleRevision={handleToggleRevision}
                  initialFilterStatus="Revision"
                  initialBank="all"
                  onPickRandom={handlePickRandom}
                />
              )}

              {/* Analytics Dashboard */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  onSelectQuestion={handleSelectQuestion}
                  onNavigateToBank={() => setActiveTab('problems')}
                  onNavigateToRevision={() => setActiveTab('revision')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Absolute Fullscreen Floating Exit Pill */}
      {isAbsoluteFullscreen && (
        <div className="fixed top-2.5 right-4 z-[999] flex items-center gap-2 bg-[#181818]/95 backdrop-blur-md border border-[#383838] px-3.5 py-1.5 rounded-full shadow-2xl text-xs text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-[#FFA116] animate-pulse" />
          <span className="font-semibold text-white hidden sm:inline">Absolute Fullscreen</span>
          <button
            onClick={toggleAbsoluteFullscreen}
            className="ml-1 px-2.5 py-0.5 rounded bg-[#282828] hover:bg-[#383838] text-neutral-200 hover:text-white border border-[#444] transition-colors flex items-center gap-1.5 font-mono text-[11px] cursor-pointer"
            title="Exit Absolute Fullscreen (Esc or Alt+Enter)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-[#FFA116]" />
            <span>Exit (Esc)</span>
          </button>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        dailyGoal={stats?.dailyGoal || 3}
        onUpdateDailyGoal={(newGoal) => {
          if (stats) setStats({ ...stats, dailyGoal: newGoal });
        }}
        systemHealth={systemHealth}
        onDataReset={loadInitialData}
      />
    </div>
  );
};

export default App;
