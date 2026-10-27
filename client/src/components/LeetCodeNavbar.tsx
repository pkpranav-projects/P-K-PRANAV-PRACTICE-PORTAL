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
  ArrowLeft,
  Menu,
  BookOpen,
  PanelTopClose,
  Sparkles,
  Timer,
  GraduationCap,
  BookmarkCheck
} from 'lucide-react';
import { PranavJavaSymbol } from './PranavJavaSymbol';
import { SystemHealth } from '../types';
import { PracticeTimer } from './PracticeTimer';

export type LeetCodeTab =
  | 'explore'
  | 'problems'
  | 'workspace'
  | 'dbms'
  | 'sql-course'
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
  onOpenMobileDrawer?: () => void;
  onHideTopBar?: () => void;
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
  isAbsoluteFullscreen = false,
  onToggleAbsoluteFullscreen,
  onOpenCommandPalette,
  onOpenShortcutsModal,
  isSoundEnabled = true,
  onToggleSound,
  onBack,
  backLabel = 'Questions',
  onOpenMobileDrawer,
  onHideTopBar
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('oled');
    else if (theme === 'oled') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const isMoreActive =
    activeTab === 'exam' ||
    activeTab === 'masterclass' ||
    activeTab === 'curriculum' ||
    activeTab === 'revision' ||
    activeTab === 'dashboard';

  return (
    <nav className="flex h-[50px] w-full items-center border-b border-slate-200 dark:border-[#383838] bg-white dark:bg-[#242424] text-slate-700 dark:text-[#eff1f6bf] select-none sticky top-0 z-50 transition-colors shadow-xs">
      <div className="w-full max-w-[1700px] h-full mx-auto px-2.5 sm:px-6 flex items-center justify-between gap-2">
        
        {/* Left side: Hamburger, Brand Logo, Back button, and Core Desktop Tabs */}
        <div className="flex items-center h-full gap-2 sm:gap-4 lg:gap-6 min-w-0 shrink-0">
          {/* Mobile Navigation Drawer Hamburger Button */}
          {onOpenMobileDrawer && (
            <button
              onClick={onOpenMobileDrawer}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#333] transition-colors cursor-pointer shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Brand Logo with PK Symbol and PRANAV Practice Portal title */}
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none group pr-1 sm:pr-2 shrink-0"
            aria-label="PRANAV Practice Portal"
          >
            <PranavJavaSymbol className="h-[26px] w-[26px] sm:h-[28px] sm:w-[28px] flex-shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-slate-900 dark:text-white font-extrabold text-[15px] sm:text-[16px] tracking-tight font-sans">
                PRANAV
              </span>
              <span className="hidden sm:inline text-slate-500 dark:text-neutral-300 font-medium text-[14px] sm:text-[15px] font-sans">
                Practice
              </span>
              <span className="hidden md:inline text-[#FFA116] font-bold text-[14px] sm:text-[15px] tracking-wide font-sans">
                Portal
              </span>
            </div>
          </button>

          {/* Back Button when in Workspace */}
          {activeTab === 'workspace' && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#333] dark:hover:bg-[#444] border border-slate-300/80 dark:border-neutral-700 transition-all cursor-pointer shadow-sm group shrink-0"
              title={`Back to ${backLabel || 'Questions'} (or Browser Back)`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-500 group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <span className="hidden sm:inline">Back to {backLabel || 'Questions'}</span>
              <span className="sm:hidden">Back</span>
            </button>
          )}

          {/* Navigation Links (Desktop: Uncluttered & Guaranteed No Overlap) */}
          <div className="hidden lg:flex items-center h-full gap-4 xl:gap-5 text-sm font-medium shrink-0">
            {/* Explore Tab */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`relative h-full flex items-center px-1 transition-colors whitespace-nowrap shrink-0 ${
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
              className={`relative h-full flex items-center px-1 transition-colors whitespace-nowrap shrink-0 ${
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
              className={`relative h-full flex items-center gap-1.5 px-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'dbms'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
              }`}
              title="DBMS & SQL Engineering Lab"
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

            {/* SQL Handbook Tab (W3Schools 77 Lessons Ad-Free) */}
            <button
              onClick={() => setActiveTab('sql-course')}
              className={`relative h-full flex items-center gap-1.5 px-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'sql-course'
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
              }`}
              title="W3Schools SQL Master Handbook (77 Topics, Continuous Reader)"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>SQL Guide</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                W3
              </span>
              {activeTab === 'sql-course' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
              )}
            </button>

            {/* Direct Contest Tab on Wide screens */}
            <button
              onClick={() => setActiveTab('exam')}
              className={`relative h-full hidden 2xl:flex items-center px-1 transition-colors whitespace-nowrap shrink-0 ${
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

            {/* Direct Masterclass Tab on Wide screens */}
            <button
              onClick={() => setActiveTab('masterclass')}
              className={`relative h-full hidden 2xl:flex items-center px-1 transition-colors whitespace-nowrap shrink-0 ${
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

            {/* Unified More ▾ Dropdown (Organized, zero overlap) */}
            <div className="relative h-full flex items-center shrink-0">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                onBlur={() => setTimeout(() => setIsMoreMenuOpen(false), 200)}
                className={`relative h-full flex items-center gap-1 px-1.5 transition-colors whitespace-nowrap ${
                  isMoreActive
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-[#eff1f6bf] dark:hover:text-white'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                {isMoreActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 dark:bg-white rounded-t-sm" />
                )}
              </button>

              {isMoreMenuOpen && (
                <div className="absolute top-[50px] left-0 w-56 bg-white dark:bg-[#282828] border border-slate-200 dark:border-[#383838] rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => {
                      setActiveTab('exam');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <Timer className="w-4 h-4 text-rose-400" />
                    <span>Contest / Timed Exam</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('masterclass');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Java Masterclass (64 Methods)</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('curriculum');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-500" />
                    <span>Study Curriculum (27 Guides)</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('revision');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <BookmarkCheck className="w-4 h-4 text-purple-400" />
                    <span>Revision Queue</span>
                  </button>

                  <div className="border-t border-slate-200 dark:border-[#383838] my-1" />

                  <button
                    onClick={() => {
                      onOpenSettings();
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-[#333] text-slate-700 dark:text-slate-200 flex items-center gap-2.5 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings & Backup</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Search + Timer + Streak + Audio + Theme + Fullscreen + Hide Top Bar Button */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Mobile Search Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#383838] transition-colors cursor-pointer"
              title="Search questions & commands (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Quick Command Palette Search (Desktop: Safe max-width so it never collides) */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1f1f1f] dark:hover:bg-[#282828] border border-slate-200 dark:border-[#383838] text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer text-xs max-w-[140px] xl:max-w-[170px]"
              title="Search questions & commands (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400 shrink-0" />
              <span className="truncate">Search...</span>
              <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-[#2e2e2e] text-slate-600 dark:text-neutral-300 border border-slate-300 dark:border-[#444] shrink-0">
                Ctrl+K
              </kbd>
            </button>
          )}

          {/* Practice Stopwatch & Pomodoro Timer */}
          <PracticeTimer />

          {/* Practice Streak Flame Indicator */}
          <div
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Daily Practice Streak"
          >
            <Flame className="w-4 h-4 fill-current text-orange-500 shrink-0" />
            <span className="font-mono text-xs">{Math.max(1, solvedToday)}</span>
          </div>

          {/* Audio Sound Toggle */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#383838] transition-colors cursor-pointer text-slate-600 dark:text-neutral-300 hidden sm:flex"
              title={isSoundEnabled ? 'Audio Effects: Enabled (Click to mute)' : 'Audio Effects: Muted'}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-neutral-500" />}
            </button>
          )}

          {/* 1-Click OLED Pitch Black Toggle */}
          <button
            onClick={() => setTheme(theme === 'oled' ? 'dark' : 'oled')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              theme === 'oled'
                ? 'bg-black text-[#FFA116] border border-[#FFA116] shadow-[0_0_12px_rgba(255,161,22,0.35)] ring-1 ring-[#FFA116]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:bg-[#1f1f1f] dark:hover:bg-[#282828] border border-slate-200 dark:border-[#383838]'
            }`}
            title={theme === 'oled' ? 'OLED Pitch Black Active (#000000). Click to switch to Dark.' : 'Switch to Pure Pitch Black OLED Mode (#000000)'}
            aria-label="Toggle OLED Pitch Black Mode"
          >
            <span className={`w-2 h-2 rounded-full ${theme === 'oled' ? 'bg-[#FFA116] shadow-[0_0_6px_#FFA116]' : 'bg-neutral-500'}`} />
            <span className="text-[11px] tracking-wide">OLED</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#383838] transition-colors cursor-pointer"
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
              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                isAbsoluteFullscreen
                  ? 'bg-amber-100 text-amber-600 dark:bg-[#FFA116]/20 dark:text-[#FFA116] ring-1 ring-amber-400 dark:ring-[#FFA116]/60 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#383838]'
              }`}
              title="Absolute Fullscreen (Hides top bar & contracts sidebar)"
              aria-label="Absolute Fullscreen"
            >
              {isAbsoluteFullscreen ? (
                <Minimize2 className="w-4 h-4 text-amber-600 dark:text-[#FFA116]" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}

          {/* NEW: Dedicated Hide Top Bar Button */}
          {onHideTopBar && (
            <button
              onClick={onHideTopBar}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#383838] transition-colors cursor-pointer"
              title="Hide Top Bar (Full Screen Reading)"
              aria-label="Hide Top Bar"
            >
              <PanelTopClose className="w-4 h-4 text-slate-400 hover:text-amber-400 transition-colors" />
            </button>
          )}

          {/* Solved Progress Counter */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#383838] transition-colors cursor-pointer shrink-0"
            title="View Dashboard Analytics"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center">
              ✓
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-neutral-300 font-semibold">
              {totalSolved}/{totalQuestions}
            </span>
          </button>

        </div>

      </div>
    </nav>
  );
};

export default LeetCodeNavbar;
