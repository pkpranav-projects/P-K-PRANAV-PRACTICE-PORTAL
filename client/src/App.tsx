import React, { useState, useEffect, useCallback } from 'react';
import { Minimize2 } from 'lucide-react';
import { LeetCodeNavbar, LeetCodeTab } from './components/LeetCodeNavbar';
import { LeetCodeSidebar } from './components/LeetCodeSidebar';
import { ExploreView } from './components/ExploreView';
import { QuestionBankView } from './components/QuestionBankView';
import { ProblemWorkspaceView } from './components/ProblemWorkspaceView';
import { DBMSPracticeView } from './components/DBMSPracticeView';
import { CurriculumView } from './components/CurriculumView';
import { MasterclassView } from './components/MasterclassView';
import { ExamModeView } from './components/ExamModeView';
import { DashboardView } from './components/DashboardView';
import { SettingsModal } from './components/SettingsModal';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { soundManager } from './services/sound';
import { api } from './services/api';
import { DashboardStats, QuestionSummary, SystemHealth } from './types';

export const App: React.FC = () => {
  // LeetCode default landing page is 'explore'
  const [activeTab, setActiveTab] = useState<LeetCodeTab>('explore');
  const [activeQuestionId, setActiveQuestionId] = useState<string>('java-001');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarFullyContracted, setIsSidebarFullyContracted] = useState(false);
  const [isAbsoluteFullscreen, setIsAbsoluteFullscreen] = useState(false);
  const [selectedBankFilter, setSelectedBankFilter] = useState<'bank1' | 'bank2' | 'bank3' | 'bank4' | 'dbms' | 'all'>('all');
  const [questionViewMode, setQuestionViewMode] = useState<'table' | 'cards' | 'topic'>(() => {
    try {
      return (localStorage.getItem('arena_question_view_mode') as any) || 'table';
    } catch {
      return 'table';
    }
  });

  const [theme, setTheme] = useState<'dark' | 'oled' | 'light' | 'system'>(() => {
    return (localStorage.getItem('arena_theme') as any) || 'dark';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => soundManager.enabled);

  const toggleSound = useCallback(() => {
    const next = soundManager.toggle();
    setIsSoundEnabled(next);
  }, []);

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

  // Global Keyboard shortcuts: Ctrl+K (Palette), Ctrl+B (Sidebar), ? (Shortcuts Cheatsheet)
  useEffect(() => {
    const handleGlobalHotkeys = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K: Command Palette
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Ctrl+B / Cmd+B: Sidebar Collapse
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
      // ?: Keyboard Shortcuts Modal (when not actively typing in an input/textarea)
      else if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        const tagName = target?.tagName?.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea' && !target?.isContentEditable) {
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalHotkeys);
    return () => window.removeEventListener('keydown', handleGlobalHotkeys);
  }, []);

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

  // Navigation history & previous tab tracking for seamless back button support
  const [previousTab, setPreviousTab] = useState<LeetCodeTab>('problems');

  const getTabLabel = useCallback((tab: LeetCodeTab): string => {
    switch (tab) {
      case 'explore': return 'Explore';
      case 'problems': return 'Problem List';
      case 'dbms': return 'DBMS Lab';
      case 'curriculum': return 'Curriculum';
      case 'masterclass': return 'Masterclass';
      case 'exam': return 'Contest Mode';
      case 'revision': return 'Revision';
      case 'dashboard': return 'Dashboard';
      default: return 'Questions';
    }
  }, []);

  const parseHash = useCallback((hash: string): { tab: LeetCodeTab; questionId?: string } => {
    const clean = hash.replace(/^#\/?/, '').trim();
    if (!clean) return { tab: 'explore' };
    const parts = clean.split('/');
    const tabName = parts[0] as LeetCodeTab;
    const qId = parts[1];
    const validTabs: LeetCodeTab[] = ['explore', 'problems', 'workspace', 'dbms', 'masterclass', 'curriculum', 'exam', 'revision', 'dashboard'];
    if (validTabs.includes(tabName)) {
      return { tab: tabName, questionId: qId };
    }
    return { tab: 'explore' };
  }, []);

  // Centralized tab & question navigation with browser history sync
  const navigateToTab = useCallback((newTab: LeetCodeTab, questionId?: string, push = true) => {
    setActiveTab((curr) => {
      if (newTab === 'workspace' && curr !== 'workspace') {
        setPreviousTab(curr);
      }
      return newTab;
    });

    if (questionId) {
      setActiveQuestionId(questionId);
    }

    const hash = newTab === 'workspace' && questionId
      ? `#workspace/${questionId}`
      : `#${newTab}`;

    if (push && window.location.hash !== hash) {
      window.history.pushState({ tab: newTab, questionId }, '', hash);
    }
  }, []);

  // Back button handler for UI buttons and shortcut keys
  const handleBack = useCallback(() => {
    if (window.history.length > 1 && window.location.hash.startsWith('#workspace')) {
      window.history.back();
    } else {
      navigateToTab(previousTab || 'problems', undefined, true);
    }
  }, [previousTab, navigateToTab]);

  // Sync with browser Back and Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
        if (e.state.questionId) {
          setActiveQuestionId(e.state.questionId);
        }
      } else {
        const parsed = parseHash(window.location.hash);
        setActiveTab(parsed.tab);
        if (parsed.questionId) {
          setActiveQuestionId(parsed.questionId);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseHash]);

  // Initialize view from URL hash on first load
  useEffect(() => {
    if (window.location.hash) {
      const parsed = parseHash(window.location.hash);
      setActiveTab(parsed.tab);
      if (parsed.questionId) {
        setActiveQuestionId(parsed.questionId);
      }
      window.history.replaceState({ tab: parsed.tab, questionId: parsed.questionId }, '', window.location.hash);
    } else {
      window.history.replaceState({ tab: 'explore' }, '', '#explore');
    }
  }, [parseHash]);

  // Select question and open workspace
  const handleSelectQuestion = (questionId: string) => {
    navigateToTab('workspace', questionId, true);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#1a1a1a] dark:text-[#eff1f6bf] flex flex-col select-none transition-colors duration-200">
      {/* Authentic LeetCode Top Navigation Bar (Fixed 50px) */}
      <LeetCodeNavbar
        activeTab={activeTab}
        setActiveTab={(tab) => navigateToTab(tab, undefined, true)}
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
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={toggleSound}
        onBack={handleBack}
        backLabel={getTabLabel(previousTab)}
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
            setActiveTab={(tab) => navigateToTab(tab, undefined, true)}
            onSelectBank={(bank) => {
              setSelectedBankFilter(bank);
              navigateToTab('problems', undefined, true);
            }}
            totalQuestions={stats?.totalQuestions || 101}
            totalSolved={stats?.solvedCount || 0}
            bank1Solved={stats?.bank1Solved || 0}
            bank1Total={stats?.bank1Total || 30}
            bank2Solved={stats?.bank2Solved || 0}
            bank2Total={stats?.bank2Total || 15}
            bank3Solved={stats?.bank3Solved || 0}
            bank3Total={stats?.bank3Total || 56}
            bank4Solved={stats?.bank4Solved || 0}
            bank4Total={stats?.bank4Total || 32}
            dbmsSolved={stats?.dbmsSolved || 0}
            dbmsTotal={stats?.dbmsTotal || 12}
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
              {/* LeetCode Explore Page (Authentic, On-Point Explorables) */}
              {activeTab === 'explore' && (
                <ExploreView
                  stats={stats}
                  questions={questions}
                  onSelectQuestion={handleSelectQuestion}
                  onNavigateToBank={(bank) => {
                    setSelectedBankFilter(bank);
                    navigateToTab('problems', undefined, true);
                  }}
                  onNavigateToDBMS={() => navigateToTab('dbms', undefined, true)}
                  onNavigateToTopicMode={() => {
                    setQuestionViewMode('topic');
                    try { localStorage.setItem('arena_question_view_mode', 'topic'); } catch {}
                    setSelectedBankFilter('all');
                    navigateToTab('problems', undefined, true);
                  }}
                  onNavigateToMasterclass={() => navigateToTab('masterclass', undefined, true)}
                  onNavigateToCurriculum={() => navigateToTab('curriculum', undefined, true)}
                  onNavigateToExam={() => navigateToTab('exam', undefined, true)}
                  onNavigateToRevision={() => navigateToTab('revision', undefined, true)}
                  onNavigateToDashboard={() => navigateToTab('dashboard', undefined, true)}
                  onNavigateToWorkspace={() => {
                    if (activeQuestionId) {
                      navigateToTab('workspace', activeQuestionId, true);
                    } else {
                      handlePickRandom();
                    }
                  }}
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
                  initialViewMode={questionViewMode}
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
                  onBack={handleBack}
                  backLabel={getTabLabel(previousTab)}
                />
              )}

              {/* DBMS & SQL Engineering Lab Arena */}
              {activeTab === 'dbms' && (
                <DBMSPracticeView
                  questions={questions}
                  onSelectQuestion={handleSelectQuestion}
                  onNavigateToBank={(bank) => {
                    setSelectedBankFilter(bank);
                    navigateToTab('problems', undefined, true);
                  }}
                />
              )}

              {/* Java Masterclass & A-Z Reference */}
              {activeTab === 'masterclass' && (
                <MasterclassView
                  onSelectQuestion={handleSelectQuestion}
                  onNavigateToBank={(bank) => {
                    setSelectedBankFilter(bank);
                    navigateToTab('problems', undefined, true);
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
                  onNavigateToBank={() => navigateToTab('problems', undefined, true)}
                  onNavigateToRevision={() => navigateToTab('revision', undefined, true)}
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

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        questions={questions}
        onSelectQuestion={handleSelectQuestion}
        setActiveTab={setActiveTab}
        onPickRandom={handlePickRandom}
        theme={theme}
        setTheme={setTheme}
        onToggleFullscreen={toggleAbsoluteFullscreen}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal (?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default App;
