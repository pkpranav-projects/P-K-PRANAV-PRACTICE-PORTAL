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
  FolderGit2,
  FolderTree,
  Database
} from 'lucide-react';
import { LeetCodeTab } from './LeetCodeNavbar';

interface LeetCodeSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isFullyContracted?: boolean;
  onToggleFullContract?: () => void;
  activeTab: LeetCodeTab;
  setActiveTab: (tab: LeetCodeTab) => void;
  onSelectBank?: (bank: 'bank1' | 'bank2' | 'bank3' | 'dbms' | 'all') => void;
  totalQuestions: number;
  totalSolved: number;
  bank1Solved: number;
  bank1Total: number;
  bank2Solved: number;
  bank2Total: number;
  bank3Solved?: number;
  bank3Total?: number;
  dbmsSolved?: number;
  dbmsTotal?: number;
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
  bank2Total,
  bank3Solved = 0,
  bank3Total = 56,
  dbmsSolved = 0,
  dbmsTotal = 12
}) => {
  const [width, setWidth] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem('arena_sidebar_width');
      return saved ? parseInt(saved, 10) : 240;
    } catch {
      return 240;
    }
  });
  const [isResizing, setIsResizing] = React.useState(false);

  const startResizing = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      const startX = e.clientX;
      const startWidth = width;
      let currentWidth = startWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        currentWidth = startWidth + delta;
        if (currentWidth >= 160 && currentWidth <= 480) {
          setWidth(currentWidth);
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        if (currentWidth < 130) {
          onToggleCollapse();
        } else {
          const finalWidth = Math.max(160, Math.min(480, currentWidth));
          setWidth(finalWidth);
          try {
            localStorage.setItem('arena_sidebar_width', finalWidth.toString());
          } catch {}
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [width, onToggleCollapse]
  );

  return (
    <>
      {/* Floating Edge Trigger Tab when Sidebar is Fully Contracted */}
      {isFullyContracted && (
        <button
          onClick={onToggleFullContract || onToggleCollapse}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-[#252525] hover:bg-slate-100 dark:hover:bg-[#323232] text-amber-600 dark:text-[#FFA116] border border-slate-300 dark:border-[#3e3e3e] border-l-0 rounded-r-lg px-1.5 py-4 shadow-2xl flex items-center justify-center group transition-all duration-200 cursor-pointer"
          title="Expand Sidebar (Click to restore)"
          aria-label="Expand Sidebar"
        >
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      <aside
        style={{
          width: isFullyContracted ? 0 : isCollapsed ? 64 : width
        }}
        className={`relative sticky top-[50px] h-[calc(100vh-50px)] bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-[#eff1f6bf] select-none z-30 flex flex-col justify-between transition-colors ${
          isResizing ? '' : 'transition-[width] duration-200'
        } ${
          isFullyContracted
            ? 'border-r-0 p-0 m-0 opacity-0 pointer-events-none overflow-hidden'
            : 'border-r border-slate-200 dark:border-[#2e2e2e]'
        }`}
      >
        {/* Interactive Drag-to-Resize Handle */}
        {!isFullyContracted && !isCollapsed && (
          <div
            onMouseDown={startResizing}
            onDoubleClick={() => {
              setWidth(240);
              try {
                localStorage.setItem('arena_sidebar_width', '240');
              } catch {}
            }}
            className={`absolute top-0 right-[-3px] w-2 h-full cursor-col-resize z-40 group hover:bg-[#FFA116]/40 transition-colors ${
              isResizing ? 'bg-[#FFA116]' : ''
            }`}
            title="Drag to resize sidebar (Double-click to reset 240px)"
          >
            <div className="w-[2px] h-8 bg-slate-300 dark:bg-neutral-600 group-hover:bg-[#FFA116] rounded absolute top-1/2 -translate-y-1/2 right-[2px] transition-colors" />
          </div>
        )}

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
        
        {/* Explore Item */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'explore'
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
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
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
          }`}
          title="All Problems"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
            {!isCollapsed && <span className="truncate">Problems</span>}
          </div>
          {!isCollapsed && (
            <span className="text-xs font-mono text-slate-500 dark:text-neutral-400">
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
          } text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]`}
          title="Question Bank 1: Photo Portal"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Bank 1 (Photos)</span>}
          </div>
          {!isCollapsed && (
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
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
          } text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]`}
          title="Question Bank 2: Modern Java"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Bank 2 (Modern)</span>}
          </div>
          {!isCollapsed && (
            <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
              {bank2Solved}/{bank2Total}
            </span>
          )}
        </button>

        {/* Bank 3 (Lab Tests) */}
        <button
          onClick={() => {
            if (onSelectBank) onSelectBank('bank3');
            setActiveTab('problems');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors pl-4 ${
            !isCollapsed ? '' : 'justify-center pl-3'
          } text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]`}
          title="Question Bank 3: Lab Tests"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Bank 3 (Lab Tests)</span>}
          </div>
          {!isCollapsed && (
            <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 font-medium">
              {bank3Solved}/{bank3Total}
            </span>
          )}
        </button>

        {/* Bank 4 (DBMS & SQL Lab) */}
        <button
          onClick={() => {
            if (onSelectBank) onSelectBank('dbms');
            setActiveTab('problems');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors pl-4 ${
            !isCollapsed ? '' : 'justify-center pl-3'
          } text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]`}
          title="Question Bank 4: DBMS & SQL Lab"
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Bank 4 (DBMS)</span>}
          </div>
          {!isCollapsed && (
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {dbmsSolved}/{dbmsTotal}
            </span>
          )}
        </button>

        {/* Topic Mode (Questions by Topic) */}
        <button
          onClick={() => {
            try { localStorage.setItem('arena_question_view_mode', 'topic'); } catch {}
            setActiveTab('problems');
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors pl-4 ${
            !isCollapsed ? '' : 'justify-center pl-3'
          } text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]`}
          title="Topic Mode: Questions Grouped by Topic"
        >
          <div className="flex items-center gap-2.5 truncate">
            <FolderTree className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Topic Mode</span>}
          </div>
          {!isCollapsed && (
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
              Grouped
            </span>
          )}
        </button>

        <div className="pt-2 pb-1 border-t border-slate-200 dark:border-[#2e2e2e] my-2" />

        {/* DBMS Practice */}
        <button
          onClick={() => setActiveTab('dbms')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'dbms'
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
          }`}
          title="DBMS & SQL Practice Arena"
        >
          <Database className="w-5 h-5 flex-shrink-0 text-amber-500 dark:text-amber-400" />
          {!isCollapsed && <span className="truncate">DBMS Practice</span>}
        </button>

        {/* Masterclass (Discuss / Encyclopedia) */}
        <button
          onClick={() => setActiveTab('masterclass')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'masterclass'
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
          }`}
          title="Java Masterclass (A-Z Encyclopedia)"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0 text-purple-500 dark:text-purple-400" />
          {!isCollapsed && <span className="truncate">Masterclass</span>}
        </button>

        {/* Curriculum (Study Plan) */}
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'curriculum'
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
          }`}
          title="Study Curriculum (27 Guides)"
        >
          <GraduationCap className="w-5 h-5 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
          {!isCollapsed && <span className="truncate">Study Plan</span>}
        </button>

        {/* Contest (Timed Exam Simulator) */}
        <button
          onClick={() => setActiveTab('exam')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'exam'
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
          }`}
          title="Contest / Exam Simulator"
        >
          <Timer className="w-5 h-5 flex-shrink-0 text-rose-500 dark:text-rose-400" />
          {!isCollapsed && <span className="truncate">Contest</span>}
        </button>

        {/* Revision Queue */}
        <button
          onClick={() => setActiveTab('revision')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'revision'
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
          }`}
          title="Revision Queue"
        >
          <BookmarkCheck className="w-5 h-5 flex-shrink-0 text-amber-500 dark:text-amber-400" />
          {!isCollapsed && <span className="truncate">Revision</span>}
        </button>

        {/* Analytics Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'bg-slate-100 text-slate-900 font-semibold dark:bg-[#2a2a2a] dark:text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#8c8c8c] dark:hover:text-white dark:hover:bg-[#222222]'
          }`}
          title="Analytics Dashboard"
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
          {!isCollapsed && <span className="truncate">Analytics</span>}
        </button>

      </div>

      {/* Sidebar Footer & Collapse Toggle Handle */}
      <div className="p-3 border-t border-slate-200 dark:border-[#2e2e2e] flex items-center justify-between bg-slate-50 dark:bg-[#181818]/60 transition-colors">
        {!isCollapsed && (
          <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
            <span>Solved: </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{totalSolved}</span>
            <span>/{totalQuestions}</span>
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {onToggleFullContract && (
            <button
              onClick={onToggleFullContract}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#282828] transition-colors cursor-pointer"
              title="Contract sidebar fully (Hide sidebar)"
              aria-label="Contract sidebar fully"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-[#282828] transition-colors cursor-pointer"
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
