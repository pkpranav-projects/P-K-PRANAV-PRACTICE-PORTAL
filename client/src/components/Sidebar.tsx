import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  GraduationCap,
  Timer,
  BookmarkCheck,
  Settings,
  Sun,
  Moon,
  Laptop,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Target,
  Sparkles
} from 'lucide-react';
import { SystemHealth } from '../types';

export type ActiveTab = 'dashboard' | 'bank' | 'workspace' | 'masterclass' | 'curriculum' | 'exam' | 'revision';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeQuestionId: string | null;
  dailyGoal: number;
  solvedToday: number;
  totalSolved: number;
  totalQuestions: number;
  systemHealth: SystemHealth | null;
  theme: 'dark' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  onOpenSettings: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeQuestionId,
  dailyGoal,
  solvedToday,
  totalSolved,
  totalQuestions,
  systemHealth,
  theme,
  setTheme,
  onOpenSettings,
  isCollapsed,
  setIsCollapsed
}) => {
  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'bank' as ActiveTab,
      label: 'Question Banks',
      icon: BookOpen,
      badge: `${totalQuestions || 45}`
    },
    {
      id: 'masterclass' as ActiveTab,
      label: 'Java Masterclass (A-Z)',
      icon: Sparkles,
      badge: '64 Methods',
      isNew: true
    },
    {
      id: 'workspace' as ActiveTab,
      label: 'Code Workspace',
      icon: Code2,
      badge: activeQuestionId ? activeQuestionId : null,
      isLive: true
    },
    {
      id: 'curriculum' as ActiveTab,
      label: 'Study Curriculum',
      icon: GraduationCap,
      badge: '27 Docs'
    },
    {
      id: 'exam' as ActiveTab,
      label: 'Exam Simulator',
      icon: Timer,
      badge: 'Timed'
    },
    {
      id: 'revision' as ActiveTab,
      label: 'Revision Queue',
      icon: BookmarkCheck,
      badge: null
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#090d16] [isolation:isolate] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header / Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold text-lg flex-shrink-0">
            ☕
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight truncate">
                  Java Arena
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                  PRANAV
                </span>
              </div>
              <span className="text-[11px] text-slate-400 truncate">
                Exam Platform
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
        <div>
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400/90 dark:text-slate-500 block mb-2">
              Navigation
            </span>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}
                  />

                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 truncate">
                      <span className="truncate">{item.label}</span>
                      
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold flex items-center gap-1 ${
                            item.isNew
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : isActive
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.isLive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Daily Goal & Progress Widget (expanded mode only) */}
        {!isCollapsed && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500" />
                <span>Daily Practice</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                {solvedToday} / {dailyGoal}
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (solvedToday / (dailyGoal || 1)) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{totalSolved} of {totalQuestions} Solved</span>
              <span>{Math.round((totalSolved / (totalQuestions || 1)) * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
        {/* Environment Status */}
        {!isCollapsed && (
          <div className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px]">OpenJDK 27</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              Ready
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title={`Current theme: ${theme.toUpperCase()}`}
          >
            {theme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'system' && <Laptop className="w-4 h-4 text-slate-400" />}
            {!isCollapsed && <span className="text-xs capitalize">{theme}</span>}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title="Settings & Data Management"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
