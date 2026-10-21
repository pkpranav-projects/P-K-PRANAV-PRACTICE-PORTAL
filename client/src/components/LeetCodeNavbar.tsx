import React, { useState } from 'react';
import {
  Flame,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
  Settings,
  Code2,
  Maximize2,
  Minimize2,
  Search,
  Volume2,
  VolumeX,
  HelpCircle,
  Database,
  ArrowLeft
} from 'lucide-react';
import { PranavJavaSymbol } from './PranavJavaSymbol';
import { SystemHealth } from '../types';
import { PracticeTimer } from './PracticeTimer';

export type LeetCodeTab =
  | 'explore'
  | 'problems'
  | 'workspace'
  | 'dbms'
  | 'masterclass'
  | 'curriculum'
  | 'exam'
  | 'revision'
  | 'dashboard';

interface LeetCodeNavbarProps {
  activeTab: LeetCodeTab;
  setActiveTab: (tab: LeetCodeTab) => void;
  dailyGoal: number;
  solvedToday: number;
  totalSolved: number;
  totalQuestions: number;
  systemHealth: SystemHealth | null;
  theme: 'dark' | 'oled' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'oled' | 'light' | 'system') => void;
  onOpenSettings: () => void;
  onPickRandom: () => void;
  activeQuestionId: string | null;
  isAbsoluteFullscreen?: boolean;
  onToggleAbsoluteFullscreen?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenShortcutsModal?: () => void;
  isSoundEnabled?: boolean;
  onToggleSound?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export const LeetCodeNavbar: React.FC<LeetCodeNavbarProps> = ({
  activeTab,
  setActiveTab,
  solvedToday,
  totalSolved,
  totalQuestions,
  theme,
  setTheme,
  onOpenSettings,
  activeQuestionId,
  isAbsoluteFullscreen = false,
  onToggleAbsoluteFullscreen,
  onOpenCommandPalette,
  onOpenShortcutsModal,
  isSoundEnabled = true,
  onToggleSound,
  onBack,
  backLabel = 'Questions'
}) => {
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('oled');
    else if (theme === 'oled') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <nav className="flex h-[50px] w-full items-center border-b border-slate-200 dark:border-[#383838] bg-white dark:bg-[#282828] text-slate-700 dark:text-[#eff1f6bf] select-none sticky top-0 z-50 transition-colors">
      <div className="w-full max-w-[1700px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left side: Authentic LeetCode Logo and Main Navigation Tabs */}
        <div className="flex items-center h-full gap-6 lg:gap-8">
          {/* Brand Logo with Symbol and PRANAV Practice JAVA title */}
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 cursor-pointer focus:outline-none group pr-2"
            aria-label="PRANAV Practice JAVA"
          >
            {/* Custom Symbol for PRANAV Practice JAVA */}
            <PranavJavaSymbol className="h-[26px] w-[26px] flex-shrink-0 group-hover:scale-105 transition-transform" />

            {/* Brand Typography: PRANAV Practice JAVA */}
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="text-slate-900 dark:text-white font-extrabold text-[16px] tracking-tight font-sans">
                PRANAV
              </span>
              <span className="text-slate-500 dark:text-neutral-300 font-medium text-[15px] font-sans">
                Practice
              </span>
              <span className="text-[#FFA116] font-bold text-[15px] tracking-wide font-sans">
                JAVA
              </span>
            </div>
          </button>

          {/* Back Button when in Workspace */}
          {activeTab === 'workspace' && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#333] dark:hover:bg-[#444] border border-slate-300/80 dark:border-neutral-700 transition-all cursor-pointer shadow-sm group shrink-0"
              title={`Back to ${backLabel || 'Questions'} (or Browser Back)`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-500 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to {backLabel || 'Questions'}</span>
            </button>
          )}

          {/* Navigation Links matching LeetCode (Problems, Contest, Discuss, Interview, Store) */}
          <div className="flex items-center h-full gap-5 text-sm font-medium">
            
            {/* Explore Tab */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`relative h-full flex items-center px-1 transition-colors ${
                activeTab === 'explore'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
              }`}
            >
              <span>Explore</span>
              {activeTab === 'explore' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
              )}
            </button>

            {/* Problems Tab */}
            <button
              onClick={() => setActiveTab('problems')}
              className={`relative h-full flex items-center px-1 transition-colors ${
                activeTab === 'problems'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
              }`}
            >
              <span>Problems</span>
              {activeTab === 'problems' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
              )}
            </button>

            {/* DBMS & SQL Lab Tab */}
            <button
              onClick={() => setActiveTab('dbms')}
              className={`relative h-full flex items-center gap-1.5 px-1 transition-colors ${
                activeTab === 'dbms'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
              }`}
              title="DBMS & SQL Engineering Lab (Triggers, Stored Procedures, Schemas)"
            >
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>DBMS Lab</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                SQL
              </span>
              {activeTab === 'dbms' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
              )}
            </button>

            {/* Contest Tab (Exam Simulator) */}
            <button
              onClick={() => setActiveTab('exam')}
              className={`relative h-full flex items-center px-1 transition-colors ${
                activeTab === 'exam'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
              }`}
            >
              <span>Contest</span>
              {activeTab === 'exam' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
              )}
            </button>

            {/* Discuss Tab (Java Masterclass Encyclopedia) */}
            <button
              onClick={() => setActiveTab('masterclass')}
              className={`relative h-full flex items-center px-1 transition-colors ${
                activeTab === 'masterclass'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
              }`}
            >
              <span>Discuss</span>
              {activeTab === 'masterclass' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
              )}
            </button>

            {/* Interview Dropdown (Curriculum 27 Guides & Revision) */}
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setIsInterviewOpen(!isInterviewOpen)}
                onBlur={() => setTimeout(() => setIsInterviewOpen(false), 200)}
                className={`relative h-full flex items-center gap-1 px-1 transition-colors ${
                  activeTab === 'curriculum' || activeTab === 'revision'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
                }`}
              >
                <span>Interview</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                {(activeTab === 'curriculum' || activeTab === 'revision') && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
                )}
              </button>

              {isInterviewOpen && (
                <div className="absolute top-[50px] left-0 w-52 bg-white dark:bg-[#282828] border border-slate-200 dark:border-[#383838] rounded-b-lg shadow-xl py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('curriculum');
                      setIsInterviewOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-[#eff1f6bf] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Study Curriculum (27 Guides)
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('revision');
                      setIsInterviewOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-[#eff1f6bf] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Revision Queue
                  </button>
                </div>
              )}
            </div>

            {/* Store (Gold/Orange Text) */}
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setIsStoreOpen(!isStoreOpen)}
                onBlur={() => setTimeout(() => setIsStoreOpen(false), 200)}
                className="relative h-full flex items-center gap-1 px-1 text-[#FFA116] hover:text-[#ffb342] transition-colors"
              >
                <span>Store</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {isStoreOpen && (
                <div className="absolute top-[50px] left-0 w-48 bg-white dark:bg-[#282828] border border-slate-200 dark:border-[#383838] rounded-b-lg shadow-xl py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      onOpenSettings();
                      setIsStoreOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-[#eff1f6bf] hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings & Backup</span>
                  </button>
                  <div className="px-4 py-2 text-[11px] text-slate-500 dark:text-neutral-400 border-t border-slate-200 dark:border-[#383838] flex items-center justify-between">
                    <span>OpenJDK 27</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-mono">SANDBOX</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Workspace Editor Resume (if active question) */}
            {activeQuestionId && (
              <button
                onClick={() => setActiveTab('workspace')}
                className={`relative h-full hidden xl:flex items-center gap-1.5 px-2 transition-colors ${
                  activeTab === 'workspace'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-mono">{activeQuestionId}</span>
                {activeTab === 'workspace' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
                )}
              </button>
            )}

          </div>
        </div>

        {/* Right side: Search + Timer + Flame + Sound + Shortcuts + Theme + Fullscreen + Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Quick Command Palette Search */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1f1f1f] dark:hover:bg-[#282828] border border-slate-200 dark:border-[#383838] text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer text-xs"
              title="Search questions & commands (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400" />
              <span>Search...</span>
              <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-[#2e2e2e] text-slate-600 dark:text-neutral-300 border border-slate-300 dark:border-[#444]">
                Ctrl+K
              </kbd>
            </button>
          )}

          {/* Practice Stopwatch & Pomodoro Timer */}
          <PracticeTimer />

          {/* Practice Streak Flame Indicator */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Practice Streak"
          >
            <Flame className="w-4 h-4 fill-current text-orange-500" />
            <span className="font-mono text-xs">{Math.max(1, solvedToday)}</span>
          </div>

          {/* Audio Sound Toggle */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#383838] transition-colors cursor-pointer text-slate-600 dark:text-neutral-300"
              title={isSoundEnabled ? 'Audio Effects: Enabled (Click to mute)' : 'Audio Effects: Muted (Click to enable)'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-neutral-500" />}
            </button>
          )}

          {/* Keyboard Shortcuts Cheatsheet */}
          {onOpenShortcutsModal && (
            <button
              onClick={onOpenShortcutsModal}
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#383838] transition-colors cursor-pointer hidden sm:flex"
              title="Keyboard Shortcuts Cheatsheet (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#383838] transition-colors"
            title={`Theme: ${theme === 'oled' ? 'OLED Black' : theme.toUpperCase()} (Click to cycle)`}
          >
            {theme === 'dark' && <Moon className="w-4 h-4 text-neutral-300" />}
            {theme === 'oled' && (
              <span className="relative flex items-center justify-center w-4 h-4">
                <span className="w-3.5 h-3.5 rounded-full bg-black border-[1.5px] border-[#FFA116] shadow-sm" />
              </span>
            )}
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'system' && <Laptop className="w-4 h-4 text-slate-500 dark:text-neutral-400" />}
          </button>

          {/* Absolute Fullscreen Toggle */}
          {onToggleAbsoluteFullscreen && (
            <button
              onClick={onToggleAbsoluteFullscreen}
              className={`p-1.5 rounded transition-all duration-200 cursor-pointer ${
                isAbsoluteFullscreen
                  ? 'bg-amber-100 text-amber-600 dark:bg-[#FFA116]/20 dark:text-[#FFA116] ring-1 ring-amber-400 dark:ring-[#FFA116]/60 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#383838]'
              }`}
              title={
                isAbsoluteFullscreen
                  ? 'Exit Absolute Fullscreen (Esc or Alt+Enter)'
                  : 'Absolute Fullscreen (Contracts sidebar fully & edge-to-edge view)'
              }
              aria-label={
                isAbsoluteFullscreen
                  ? 'Exit Absolute Fullscreen'
                  : 'Enter Absolute Fullscreen'
              }
            >
              {isAbsoluteFullscreen ? (
                <Minimize2 className="w-4 h-4 text-amber-600 dark:text-[#FFA116]" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}

          {/* User Profile Solved Avatar (Clean circle with count) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#383838] transition-colors cursor-pointer"
            title="View Dashboard Analytics"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-[#383838] border border-emerald-300 dark:border-neutral-600 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center justify-center">
              ✓
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-neutral-300">
              {totalSolved}/{totalQuestions}
            </span>
          </button>

        </div>

      </div>
    </nav>
  );
};
