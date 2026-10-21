import React, { useEffect } from 'react';
import {
  X,
  Compass,
  BookOpen,
  Code2,
  Sparkles,
  GraduationCap,
  Timer,
  BookmarkCheck,
  LayoutDashboard,
  Settings,
  Flame,
  CheckCircle2,
  Terminal,
  Layers,
  ArrowRight,
  Search,
  ExternalLink,
  Target
} from 'lucide-react';
import { LeetCodeTab } from './LeetCodeNavbar';
import { SystemHealth } from '../types';
import { PranavJavaSymbol } from './PranavJavaSymbol';

interface LeetCodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: LeetCodeTab;
  setActiveTab: (tab: LeetCodeTab) => void;
  onSelectBank?: (bank: 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'dbms' | 'all') => void;
  dailyGoal: number;
  solvedToday: number;
  totalSolved: number;
  totalQuestions: number;
  bank1Total: number;
  bank1Solved: number;
  bank2Total: number;
  bank2Solved: number;
  bank3Total?: number;
  bank3Solved?: number;
  bank4Total?: number;
  bank4Solved?: number;
  dbmsTotal?: number;
  dbmsSolved?: number;
  accuracy: number;
  systemHealth: SystemHealth | null;
  onOpenSettings: () => void;
}

export const LeetCodeDrawer: React.FC<LeetCodeDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onSelectBank,
  dailyGoal,
  solvedToday,
  totalSolved,
  totalQuestions,
  bank1Total,
  bank1Solved,
  bank2Total,
  bank2Solved,
  bank3Total = 56,
  bank3Solved = 0,
  bank4Total = 32,
  bank4Solved = 0,
  dbmsTotal = 12,
  dbmsSolved = 0,
  accuracy,
  systemHealth,
  onOpenSettings
}) => {
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (tab: LeetCodeTab, bank?: 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'dbms' | 'all') => {
    if (bank && onSelectBank) {
      onSelectBank(bank);
    }
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Semi-transparent Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/75 z-50 transition-opacity duration-300 ease-in-out [isolation:isolate] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-[#282828] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-200 dark:border-[#282828]">
          <div className="flex items-center gap-2.5">
            <PranavJavaSymbol size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              PRANAV Practice Portal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors"
            title="Close Menu (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* User Progress Mini Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500 fill-current" />
                <span>Practice Progress</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {totalSolved} / {totalQuestions} Solved
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((totalSolved / (totalQuestions || 1)) * 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-1.5 rounded bg-white dark:bg-[#1a1a1a] border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Bank 1</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {bank1Solved}/{bank1Total}
                </div>
              </div>
              <div className="p-1.5 rounded bg-white dark:bg-[#1a1a1a] border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Bank 2</div>
                <div className="text-xs font-bold text-cyan-500 font-mono">
                  {bank2Solved}/{bank2Total}
                </div>
              </div>
              <div className="p-1.5 rounded bg-white dark:bg-[#1a1a1a] border border-slate-200/60 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium">Accuracy</div>
                <div className="text-xs font-bold text-amber-500 font-mono">
                  {accuracy}%
                </div>
              </div>
            </div>
          </div>

          {/* Group 1: Explore & Problems */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Explore & Practice
            </span>

            <button
              onClick={() => handleNavClick('explore')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'explore'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Explore Tracks</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                Featured
              </span>
            </button>

            <button
              onClick={() => handleNavClick('problems', 'all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'problems'
                  ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>All Problems</span>
              </div>
              <span className="text-xs font-mono text-slate-400 font-semibold">
                {totalQuestions}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('problems', 'bank1')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors pl-8"
            >
              <span className="truncate">📸 Bank 1 (Photo Portal)</span>
              <span className="text-[11px] font-mono text-emerald-500 font-semibold">
                {bank1Solved}/{bank1Total}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('problems', 'bank2')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors pl-8"
            >
              <span className="truncate">🚀 Bank 2 (Masterclass)</span>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                {bank2Solved}/{bank2Total}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('problems', 'bank3')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors pl-8"
            >
              <span className="truncate">✨ Bank 3 (Lab Tests)</span>
              <span className="text-[11px] font-mono text-purple-400 font-semibold">
                {bank3Solved}/{bank3Total}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('problems', 'bank4')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors pl-8"
            >
              <span className="truncate">🎥 Bank 4 (Video Projects)</span>
              <span className="text-[11px] font-mono text-amber-400 font-semibold">
                {bank4Solved}/{bank4Total}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('problems', 'dbms')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828] transition-colors pl-8"
            >
              <span className="truncate">🗄️ SQL & DBMS</span>
              <span className="text-[11px] font-mono text-blue-400 font-semibold">
                {dbmsSolved}/{dbmsTotal}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('revision')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'revision'
                  ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookmarkCheck className="w-4 h-4 text-purple-400" />
                <span>Revision Queue</span>
              </div>
            </button>
          </div>

          {/* Group 2: Learning */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Learning & Encyclopedia
            </span>

            <button
              onClick={() => handleNavClick('masterclass')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'masterclass'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Java Masterclass (A-Z)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                64 Methods
              </span>
            </button>

            <button
              onClick={() => handleNavClick('curriculum')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'curriculum'
                  ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>Study Curriculum</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                27 Guides
              </span>
            </button>
          </div>

          {/* Group 3: Evaluation */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Evaluation & Analytics
            </span>

            <button
              onClick={() => handleNavClick('exam')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'exam'
                  ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Timer className="w-4 h-4 text-rose-400" />
                <span>Pranav Exam Simulator</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold">
                Timed
              </span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                <span>Analytics Dashboard</span>
              </div>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[#282828] space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px]">OpenJDK 27 Sandbox</span>
            </div>
            <span className="font-semibold text-emerald-500 text-[10px] font-mono">READY</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#282828] hover:bg-slate-200 dark:hover:bg-[#333333] text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Data Backup</span>
          </button>
        </div>
      </aside>
    </>
  );
};
