import React from 'react';
import {
  Compass,
  BookOpen,
  Sparkles,
  GraduationCap,
  Timer,
  BookmarkCheck,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  FolderGit2
} from 'lucide-react';
import { LeetCodeTab } from './LeetCodeNavbar';

interface LeetCodeSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isFullyContracted?: boolean;
  onToggleFullContract?: () => void;
  activeTab: LeetCodeTab;
  setActiveTab: (tab: LeetCodeTab) => void;
  onSelectBank?: (bank: 'bank1' | 'bank2' | 'all') => void;
  totalQuestions: number;
  totalSolved: number;
  bank1Solved: number;
  bank1Total: number;
  bank2Solved: number;
  bank2Total: number;
}

export const LeetCodeSidebar: React.FC<LeetCodeSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isFullyContracted = false,
  onToggleFullContract,
  activeTab,
  setActiveTab,
  onSelectBank,
  totalQuestions,
  totalSolved,
  bank1Solved,
  bank1Total,
  bank2Solved,
  bank2Total
}) => {
  return (
    <>
      {/* Floating Edge Trigger Tab when Sidebar is Fully Contracted */}
      {isFullyContracted && (
        <button
          onClick={onToggleFullContract || onToggleCollapse}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-[#252525] hover:bg-[#323232] text-[#FFA116] border border-[#3e3e3e] border-l-0 rounded-r-lg px-1.5 py-4 shadow-2xl flex items-center justify-center group transition-all duration-200 cursor-pointer"
          title="Expand Sidebar (Click to restore)"
          aria-label="Expand Sidebar"
        >
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      <aside
        className={`sticky top-[50px] h-[calc(100vh-50px)] bg-[#1a1a1a] select-none transition-all duration-300 z-30 flex flex-col justify-between ${
          isFullyContracted
            ? 'w-0 border-r-0 p-0 m-0 opacity-0 pointer-events-none overflow-hidden'
            : isCollapsed
            ? 'w-16 border-r border-[#2e2e2e]'
            : 'w-60 border-r border-[#2e2e2e]'
        }`}
      >
      {/* Scrollable Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        
        {/* Explore Item */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'explore'
              ? 'bg-[#2a2a2a] text-white font-semibold'
              : 'text-[#8c8c8c] hover:text-white hover:bg-[#222222]'
          }`}
          title="Explore"
        >
          <Compass className="w-5 h-5 flex-shrink-0 text-[#FFA116]" />
          {!isCollapsed && <span className="truncate">Explore</span>}
        </button>

        {/* Problems (Library) */}
        <button
          onClick={() => {
            if (onSelectBank) onSelectBank('all');
            setActiveTab('problems');
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'problems'
              ? 'bg-[#2a2a2a] text-white font-semibold'
              : 'text-[#8c8c8c] hover:text-white hover:bg-[#222222]'
          }`}
          title="All Problems"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 flex-shrink-0 text-blue-400" />
            {!isCollapsed && <span className="truncate">Problems</span>}
          </div>
          {!isCollapsed && (
            <span className="text-xs font-mono text-neutral-400">
              {totalQuestions}
            </span>
          )}
        </button>

        {/* Bank 1 (Photo Portal) */}
        <button
          onClick={() => {
            if (onSelectBank) onSelectBank('bank1');
            setActiveTab('problems');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors pl-4 ${
            !isCollapsed ? '' : 'justify-center pl-3'
          } text-[#8c8c8c] hover:text-white hover:bg-[#222222]`}
          title="Question Bank 1: Photo Portal"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Bank 1 (Photos)</span>}
          </div>
          {!isCollapsed && (
            <span className="font-mono text-[11px] text-emerald-400">
              {bank1Solved}/{bank1Total}
            </span>
          )}
        </button>

        {/* Bank 2 (Modern Java Masterclass) */}
        <button
          onClick={() => {
            if (onSelectBank) onSelectBank('bank2');
            setActiveTab('problems');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors pl-4 ${
            !isCollapsed ? '' : 'justify-center pl-3'
          } text-[#8c8c8c] hover:text-white hover:bg-[#222222]`}
          title="Question Bank 2: Modern Java"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Bank 2 (Modern)</span>}
          </div>
          {!isCollapsed && (
            <span className="font-mono text-[11px] text-cyan-400">
              {bank2Solved}/{bank2Total}
            </span>
          )}
        </button>

        <div className="pt-2 pb-1 border-t border-[#2e2e2e] my-2" />

        {/* Masterclass (Discuss / Encyclopedia) */}
        <button
          onClick={() => setActiveTab('masterclass')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'masterclass'
              ? 'bg-[#2a2a2a] text-white font-semibold'
              : 'text-[#8c8c8c] hover:text-white hover:bg-[#222222]'
          }`}
          title="Java Masterclass (A-Z Encyclopedia)"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0 text-purple-400" />
          {!isCollapsed && <span className="truncate">Masterclass</span>}
        </button>

        {/* Curriculum (Study Plan) */}
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'curriculum'
              ? 'bg-[#2a2a2a] text-white font-semibold'
              : 'text-[#8c8c8c] hover:text-white hover:bg-[#222222]'
          }`}
          title="Study Curriculum (27 Guides)"
        >
          <GraduationCap className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          {!isCollapsed && <span className="truncate">Study Plan</span>}
        </button>

        {/* Contest (Timed Exam Simulator) */}
        <button
          onClick={() => setActiveTab('exam')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'exam'
              ? 'bg-[#2a2a2a] text-white font-semibold'
              : 'text-[#8c8c8c] hover:text-white hover:bg-[#222222]'
          }`}
          title="Contest / Exam Simulator"
        >
          <Timer className="w-5 h-5 flex-shrink-0 text-rose-400" />
          {!isCollapsed && <span className="truncate">Contest</span>}
        </button>

        {/* Revision Queue */}
        <button
          onClick={() => setActiveTab('revision')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'revision'
              ? 'bg-[#2a2a2a] text-white font-semibold'
              : 'text-[#8c8c8c] hover:text-white hover:bg-[#222222]'
          }`}
          title="Revision Queue"
        >
          <BookmarkCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
          {!isCollapsed && <span className="truncate">Revision</span>}
        </button>

        {/* Analytics Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-[#2a2a2a] text-white font-semibold'
              : 'text-[#8c8c8c] hover:text-white hover:bg-[#222222]'
          }`}
          title="Analytics Dashboard"
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0 text-indigo-400" />
          {!isCollapsed && <span className="truncate">Analytics</span>}
        </button>

      </div>

      {/* Sidebar Footer & Collapse Toggle Handle */}
      <div className="p-3 border-t border-[#2e2e2e] flex items-center justify-between">
        {!isCollapsed && (
          <div className="text-[11px] text-neutral-400 font-mono">
            <span>Solved: </span>
            <span className="text-emerald-400 font-bold">{totalSolved}</span>
            <span>/{totalQuestions}</span>
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {onToggleFullContract && (
            <button
              onClick={onToggleFullContract}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#282828] transition-colors cursor-pointer"
              title="Contract sidebar fully (Hide sidebar)"
              aria-label="Contract sidebar fully"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#282828] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse to icon bar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse to icon bar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  </>
  );
};
