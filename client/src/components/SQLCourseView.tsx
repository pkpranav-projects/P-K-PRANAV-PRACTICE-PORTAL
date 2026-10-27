import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Database,
  Search,
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  ArrowUp,
  Sparkles,
  Terminal,
  BookOpen,
  Layers,
  Code2,
  RefreshCw,
  X,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Type,
  Menu,
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import sqlCourseData from '../assets/w3schools_sql_full_course.json';

interface Lesson {
  order: number;
  id: string;
  jumpId: string;
  title: string;
  navText: string;
  category: string;
  summary: string;
  examples: Array<{ heading: string; code: string }>;
  rawHtml: string;
}

interface SQLCourseViewProps {
  initialJumpId?: string;
  onNavigateToDBMS?: () => void;
}

type TextScale = 'normal' | 'large' | 'xlarge';

const PRESET_QUERIES = [
  {
    name: 'Top 5 Customers',
    sql: 'SELECT CustomerID, CustomerName, ContactName, City, Country FROM Customers LIMIT 5;'
  },
  {
    name: 'Customers in Mexico',
    sql: "SELECT CustomerID, CustomerName, City, Country FROM Customers WHERE Country = 'Mexico';"
  },
  {
    name: 'Orders + Customers Join',
    sql: 'SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID LIMIT 5;'
  },
  {
    name: 'Products Above $20',
    sql: 'SELECT ProductID, ProductName, Price FROM Products WHERE Price > 20.00 ORDER BY Price DESC;'
  },
  {
    name: 'Customer Count by Country',
    sql: 'SELECT Country, COUNT(CustomerID) AS TotalCustomers FROM Customers GROUP BY Country ORDER BY TotalCustomers DESC;'
  }
];

export const SQLCourseView: React.FC<SQLCourseViewProps> = ({
  initialJumpId,
  onNavigateToDBMS
}) => {
  const lessons: Lesson[] = useMemo(() => sqlCourseData as Lesson[], []);

  // Jump points search query
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id || 'sql_intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Text scaling state for touch & accessibility
  const [textScale, setTextScale] = useState<TextScale>(() => {
    try {
      return (localStorage.getItem('arena_sql_font_size') as TextScale) || 'large';
    } catch {
      return 'large';
    }
  });

  // Fullscreen zen mode state
  const [isZenFullscreen, setIsZenFullscreen] = useState(false);

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('arena_sql_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Collapsed categories state
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // SQL Console Drawer State
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleQuery, setConsoleQuery] = useState(PRESET_QUERIES[0].sql);
  const [consoleResult, setConsoleResult] = useState<string | null>(null);
  const [consoleError, setConsoleError] = useState<string | null>(null);
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Group lessons by category
  const categories = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    lessons.forEach(l => {
      const cat = l.category || 'General';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(l);
    });
    return Array.from(map.entries());
  }, [lessons]);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map(([cat, list]) => {
        const matchingLessons = list.filter(
          l =>
            l.title.toLowerCase().includes(q) ||
            l.navText.toLowerCase().includes(q) ||
            l.summary.toLowerCase().includes(q) ||
            l.id.toLowerCase().includes(q)
        );
        return [cat, matchingLessons] as [string, Lesson[]];
      })
      .filter(([_, list]) => list.length > 0);
  }, [categories, searchQuery]);

  // Displayed lessons for the continuous single-page reading feed
  const displayedLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase().trim();
    return lessons.filter(
      l =>
        l.title.toLowerCase().includes(q) ||
        l.navText.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        (l.rawHtml && l.rawHtml.toLowerCase().includes(q))
    );
  }, [lessons, searchQuery]);

  // Save font size preference
  const changeFontSize = (scale: TextScale) => {
    setTextScale(scale);
    try {
      localStorage.setItem('arena_sql_font_size', scale);
    } catch {}
  };

  // Toggle fullscreen mode
  const toggleZenFullscreen = useCallback(() => {
    setIsZenFullscreen(prev => {
      const next = !prev;
      if (next) {
        // Try native HTML5 fullscreen
        const el = document.documentElement as any;
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (req) req.call(el).catch(() => {});
      } else {
        const doc = document as any;
        const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        if (exit && document.fullscreenElement) exit.call(doc).catch(() => {});
      }
      return next;
    });
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenFullscreen) {
        setIsZenFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isZenFullscreen]);

  // Handle bookmark toggle
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('arena_sql_bookmarks', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  // Toggle category collapse
  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Smooth scroll to jump point
  const jumpToLesson = useCallback((id: string) => {
    setActiveLessonId(id);
    setIsMobileDrawerOpen(false);
    const element = document.getElementById(`sql-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#sql-course/${id}`);
    }
  }, []);

  // Jump to initial anchor on load
  useEffect(() => {
    if (initialJumpId) {
      setTimeout(() => jumpToLesson(initialJumpId), 300);
    }
  }, [initialJumpId, jumpToLesson]);

  // Track active section on scroll (Scrollspy)
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const scrollPos = window.scrollY + 180;
      for (let i = lessons.length - 1; i >= 0; i--) {
        const el = document.getElementById(`sql-${lessons[i].id}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveLessonId(lessons[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lessons]);

  // Handle click on Try it Yourself links within the W3Schools HTML
  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // Check if clicked anchor or child of button with data-try-sql
    const tryBtn = target.closest('[data-try-sql]');
    if (tryBtn) {
      e.preventDefault();
      const exampleBox = tryBtn.closest('.w3-example');
      if (exampleBox) {
        const codeEl = exampleBox.querySelector('.w3-code') || exampleBox.querySelector('code');
        if (codeEl) {
          const sqlText = codeEl.textContent || '';
          setConsoleQuery(sqlText.trim());
          setIsConsoleOpen(true);
          executeSQL(sqlText.trim());
          return;
        }
      }
      setIsConsoleOpen(true);
      return;
    }

    const jumpBtn = target.closest('[data-sql-jump]');
    if (jumpBtn) {
      e.preventDefault();
      const jumpTarget = jumpBtn.getAttribute('data-sql-jump');
      if (jumpTarget) {
        jumpToLesson(jumpTarget);
      }
    }
  }, [jumpToLesson]);

  // Execute SQL in the interactive console
  const executeSQL = async (queryToRun?: string) => {
    const code = queryToRun || consoleQuery;
    if (!code.trim()) return;

    setConsoleLoading(true);
    setConsoleError(null);
    setConsoleResult(null);

    try {
      const res = await api.runCode(code, undefined, 'sql' as any);
      if (res.exitCode === 0 && res.stdout) {
        setConsoleResult(res.stdout);
      } else if (res.stderr) {
        setConsoleError(res.stderr);
      } else {
        setConsoleResult('Query executed successfully. (0 rows returned or schema created)');
      }
    } catch (err: any) {
      setConsoleError(err.message || 'Execution error');
    } finally {
      setConsoleLoading(false);
    }
  };

  // Copy code to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Parse columnar stdout into table for the console
  const parsedTable = useMemo(() => {
    if (!consoleResult) return null;
    const lines = consoleResult.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return null;
    const headers = lines[0].split(/\s+/);
    const rows = lines.slice(1).map(line => line.split(/\s+/));
    return { headers, rows };
  }, [consoleResult]);

  const scaleClass =
    textScale === 'xlarge'
      ? 'sql-text-xlarge'
      : textScale === 'large'
      ? 'sql-text-large'
      : 'sql-text-normal';

  return (
    <div
      className={`min-h-screen ${scaleClass} ${
        isZenFullscreen
          ? 'fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-[#0a0e17]'
          : 'bg-slate-50 dark:bg-[#0a0e17]'
      } text-slate-900 dark:text-neutral-100 transition-colors select-text`}
    >
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0e1422]/95 backdrop-blur-xl border-b border-slate-200 dark:border-cyan-500/20 shadow-md px-3 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Course Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2.5 rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-slate-100 dark:bg-[#151d30] hover:bg-slate-200 dark:hover:bg-[#1c2740] text-emerald-600 dark:text-cyan-400 transition-all touch-manipulation min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer"
              title="Toggle Jump Points Sidebar"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Mobile Jump Points Drawer Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs min-h-[44px] touch-manipulation cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>Topics ({lessons.length})</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20">
                <Database className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                    W3Schools SQL Master Handbook
                  </h1>
                  <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {lessons.length} Topics • Ad-Free
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400 hidden md:block">
                  Continuous Single-Page Interactive Edition • Zero YouTube Promos • High-Speed SQL Sandbox
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar: Search, Text Zoom, Fullscreen, Console */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex items-center w-40 sm:w-60 md:w-72">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-cyan-400/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (displayedLessons.length > 0) {
                        jumpToLesson(displayedLessons[0].id);
                      }
                    }
                  }}
                  placeholder="Search (e.g. Normalization, Triggers)..."
                  className="w-full pl-9 pr-7 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-[#151e33] border border-slate-200 dark:border-cyan-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 min-h-[44px] touch-manipulation"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && displayedLessons.length > 0 && (
                <button
                  onClick={() => jumpToLesson(displayedLessons[0].id)}
                  className="ml-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer shrink-0 min-h-[40px]"
                  title="Jump directly to first match"
                >
                  Jump
                </button>
              )}
            </div>

            {/* Font Size Touch Controls */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-cyan-500/30 bg-slate-100 dark:bg-[#151e33] p-0.5 min-h-[44px]">
              <button
                onClick={() => changeFontSize('normal')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors touch-manipulation cursor-pointer ${
                  textScale === 'normal'
                    ? 'bg-white dark:bg-cyan-500 text-slate-900 dark:text-slate-950 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => changeFontSize('large')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors touch-manipulation cursor-pointer ${
                  textScale === 'large'
                    ? 'bg-white dark:bg-cyan-500 text-slate-900 dark:text-slate-950 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Large Font Size (Touch Friendly)"
              >
                A+
              </button>
              <button
                onClick={() => changeFontSize('xlarge')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors touch-manipulation cursor-pointer ${
                  textScale === 'xlarge'
                    ? 'bg-white dark:bg-cyan-500 text-slate-900 dark:text-slate-950 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Extra Large Font Size"
              >
                A++
              </button>
            </div>

            {/* Fullscreen Zen Mode Button */}
            <button
              onClick={toggleZenFullscreen}
              className={`p-2.5 rounded-xl border transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                isZenFullscreen
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                  : 'border-slate-200 dark:border-cyan-500/30 bg-slate-100 dark:bg-[#151e33] text-slate-600 dark:text-slate-300 hover:text-cyan-400'
              }`}
              title={isZenFullscreen ? 'Exit Full Screen (Esc)' : 'Full Screen Reading Mode'}
            >
              {isZenFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Launch Live SQL Console Button */}
            <button
              onClick={() => setIsConsoleOpen(prev => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-md shadow-emerald-500/25 transition-all min-h-[44px] touch-manipulation cursor-pointer"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">{isConsoleOpen ? 'Close Console' : 'SQL Console'}</span>
              <span className="sm:hidden">SQL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-[1700px] mx-auto flex gap-8 px-4 sm:px-6 lg:px-8 py-6 items-start">
        {/* Sticky Desktop Jump Points Sidebar */}
        {isSidebarOpen && !isZenFullscreen && (
          <aside className="hidden lg:block w-80 shrink-0 sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-2xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#0f172a] p-4 shadow-xl scrollbar-thin">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-cyan-400 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Jump Points ({filteredCategories.reduce((acc, [_, l]) => acc + l.length, 0)})</span>
              </div>
              <button
                onClick={() => {
                  const allCollapsed = categories.every(([cat]) => collapsedCategories[cat]);
                  const newState: Record<string, boolean> = {};
                  categories.forEach(([cat]) => {
                    newState[cat] = !allCollapsed;
                  });
                  setCollapsedCategories(newState);
                }}
                className="text-xs text-emerald-600 dark:text-cyan-400 hover:underline font-bold"
              >
                Toggle All
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {filteredCategories.map(([categoryName, catLessons]) => {
                const isCollapsed = !!collapsedCategories[categoryName];
                return (
                  <div key={categoryName} className="space-y-1.5">
                    <button
                      onClick={() => toggleCategory(categoryName)}
                      className="w-full flex items-center justify-between py-1.5 px-2 text-left font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-cyan-400 rounded-lg transition-colors group cursor-pointer"
                    >
                      <span className="truncate pr-1">{categoryName}</span>
                      <div className="flex items-center gap-1.5 shrink-0 text-slate-400 group-hover:text-cyan-400">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#1a233a] font-mono">
                          {catLessons.length}
                        </span>
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="pl-2 border-l-2 border-slate-200 dark:border-cyan-500/20 space-y-1 ml-1.5">
                        {catLessons.map(lesson => {
                          const isActive = activeLessonId === lesson.id;
                          const isBookmarked = bookmarkedIds.has(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => jumpToLesson(lesson.id)}
                              className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-600 dark:text-cyan-300 font-bold border-l-2 border-cyan-400 shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#162138] hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <span className="truncate">{lesson.navText}</span>
                              {isBookmarked && (
                                <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Main Content Column: Single-Page Continuous Reader */}
        <main className="flex-1 min-w-0 space-y-10" onClick={handleContentClick}>
          {/* Welcome Hero Banner */}
          <div className="rounded-3xl border border-emerald-500/30 dark:border-cyan-500/30 bg-gradient-to-br from-emerald-900/30 via-slate-900/40 to-cyan-900/30 dark:from-[#0e1e2d] dark:via-[#0c1424] dark:to-[#12102e] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ad-Free Single-Page Course</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    77 Complete Topics
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Touch & Fullscreen Ready
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  SQL A-Z: The Complete Master Guide
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Scroll continuously through every topic from basic SELECT statements to Joins, Subqueries, Stored Procedures, and Transactions. Tap any code example to run it live in the interactive SQLite database!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsConsoleOpen(true)}
                  className="px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2.5 transition-transform hover:scale-[1.02] cursor-pointer min-h-[48px]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Open SQL Console</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Search Filter Banner */}
          {searchQuery.trim() && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-cyan-300">
                  Showing {displayedLessons.length} topic{displayedLessons.length === 1 ? '' : 's'} matching "{searchQuery}"
                </span>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer"
              >
                Clear Search & Show All ({lessons.length})
              </button>
            </div>
          )}

          {/* Empty search results state with quick suggestions */}
          {searchQuery.trim() && displayedLessons.length === 0 && (
            <div className="p-8 sm:p-12 text-center rounded-3xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#0e1628] shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No SQL topics found matching "{searchQuery}"
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
                Try searching for key university lab & viva topics:
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {[
                  'Normalization',
                  'Triggers & Procedures',
                  'Joins',
                  'Nested Queries',
                  'Transactions (ACID)',
                  'Database Constraints',
                  'Views & Indexes',
                  'Aggregate Functions'
                ].map(term => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#151e33] dark:hover:bg-[#1c2740] border border-slate-200 dark:border-cyan-500/30 text-slate-700 dark:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Continuous Lessons Feed */}
          {displayedLessons.map((lesson, idx) => {
            const isBookmarked = bookmarkedIds.has(lesson.id);
            return (
              <section
                key={lesson.id}
                id={`sql-${lesson.id}`}
                className="scroll-mt-28 rounded-3xl border border-slate-200 dark:border-cyan-500/20 bg-white dark:bg-[#0e1628] shadow-lg overflow-hidden transition-all hover:border-slate-300 dark:hover:border-cyan-500/40"
              >
                {/* Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-slate-50/90 dark:bg-[#121c33]/90 border-b border-slate-200 dark:border-cyan-500/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-mono text-xs font-extrabold shadow-sm">
                      {lesson.order}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-200/80 dark:bg-[#1b2640] text-slate-700 dark:text-cyan-300 border border-slate-300/60 dark:border-cyan-500/30">
                      {lesson.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {lesson.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Share Direct Jump Link */}
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#sql-course/${lesson.id}`;
                        handleCopy(url, `link-${lesson.id}`);
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-cyan-500/30 hover:bg-slate-100 dark:hover:bg-[#1b2742] text-slate-700 dark:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer min-h-[38px]"
                      title="Copy Direct Link to Section"
                    >
                      {copiedId === `link-${lesson.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share</span>
                        </>
                      )}
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleBookmark(lesson.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center ${
                        isBookmarked
                          ? 'border-amber-500/50 bg-amber-500/15 text-amber-400 shadow-sm'
                          : 'border-slate-200 dark:border-cyan-500/30 hover:bg-slate-100 dark:hover:bg-[#1b2742] text-slate-400 hover:text-slate-600 dark:hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Topic'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Lesson Educational Content Body */}
                <div className="p-6 sm:p-9 w3-sql-prose">
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.rawHtml }}
                    className="leading-relaxed"
                  />
                </div>

                {/* Section Quick Action Footer */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-slate-50/60 dark:bg-[#0a101d] border-t border-slate-100 dark:border-cyan-500/10 text-xs sm:text-sm text-slate-500">
                  <span className="font-mono text-xs text-slate-400">Anchor: #sql-{lesson.id}</span>
                  <div className="flex items-center gap-4">
                    {idx < lessons.length - 1 && (
                      <button
                        onClick={() => jumpToLesson(lessons[idx + 1].id)}
                        className="text-emerald-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 font-bold cursor-pointer min-h-[40px]"
                      >
                        <span>Next: {lessons[idx + 1].navText}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Touch Mobile Drawer for Jump Points */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div className="bg-white dark:bg-[#0f172a] rounded-t-3xl max-h-[80vh] flex flex-col p-4 shadow-2xl border-t border-cyan-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Select Topic ({lessons.length})</span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#1a233a] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 py-3 space-y-4">
              {categories.map(([categoryName, catLessons]) => (
                <div key={categoryName} className="space-y-1">
                  <div className="font-bold text-xs uppercase tracking-wider text-cyan-400 px-2">
                    {categoryName}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {catLessons.map(lesson => (
                      <button
                        key={lesson.id}
                        onClick={() => jumpToLesson(lesson.id)}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1b2640] flex items-center justify-between min-h-[44px]"
                      >
                        <span className="truncate">{lesson.navText}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive SQL Console Drawer */}
      {isConsoleOpen && (
        <div className="fixed bottom-0 right-0 z-50 w-full md:w-[650px] lg:w-[750px] h-[550px] max-h-[90vh] bg-white dark:bg-[#0d1424] border-t md:border-l border-slate-200 dark:border-cyan-500/30 shadow-2xl rounded-t-3xl md:rounded-tl-3xl flex flex-col transition-all animate-in slide-in-from-bottom duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-cyan-500/20 bg-slate-100/80 dark:bg-[#131d33] rounded-t-3xl">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Live SQLite Sandbox (Northwind Database)
                </h4>
                <span className="text-[10px] text-slate-500 dark:text-cyan-400/80">
                  Preloaded with Customers, Orders, Products, Shippers, Categories
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setConsoleQuery(PRESET_QUERIES[0].sql);
                  executeSQL(PRESET_QUERIES[0].sql);
                }}
                className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-[#1b2742] hover:bg-slate-300 dark:hover:bg-[#233152] text-slate-700 dark:text-cyan-300 transition-colors cursor-pointer min-h-[36px]"
              >
                Reset
              </button>
              <button
                onClick={() => setIsConsoleOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Preset Query Pills (Touch Screen Friendly) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#0a0f1c] border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Presets:</span>
            {PRESET_QUERIES.map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  setConsoleQuery(preset.sql);
                  executeSQL(preset.sql);
                }}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-200/70 dark:bg-[#162138] hover:bg-emerald-500/20 text-slate-700 dark:text-cyan-300 border border-slate-300/50 dark:border-cyan-500/20 transition-all touch-manipulation cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Drawer Editor Area */}
          <div className="p-4 bg-[#080d17] border-b border-[#1a253d]">
            <textarea
              value={consoleQuery}
              onChange={e => setConsoleQuery(e.target.value)}
              placeholder="Type your SQL query here (e.g. SELECT * FROM Customers;)"
              className="w-full h-24 p-3 font-mono text-xs sm:text-sm bg-[#040810] border border-[#1e2a42] rounded-xl text-emerald-400 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Press Run to execute against in-memory SQLite database.
              </span>
              <button
                onClick={() => executeSQL()}
                disabled={consoleLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-white flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] shadow-md shadow-emerald-500/20"
              >
                {consoleLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>Run Query</span>
              </button>
            </div>
          </div>

          {/* Drawer Results View */}
          <div className="flex-1 p-4 overflow-auto bg-slate-50 dark:bg-[#070b14] text-xs sm:text-sm font-mono -webkit-overflow-scrolling-touch">
            {consoleError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Execution Error:</div>
                  <pre className="mt-1 whitespace-pre-wrap">{consoleError}</pre>
                </div>
              </div>
            )}

            {!consoleError && parsedTable && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-cyan-500/20 shadow-md">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-200 dark:bg-[#141f38] text-slate-900 dark:text-cyan-300">
                      {parsedTable.headers.map((h, i) => (
                        <th key={i} className="p-3 border-b border-slate-300 dark:border-[#202e4d] font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTable.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b border-slate-200 dark:border-[#10192e] hover:bg-slate-100 dark:hover:bg-[#131d33] transition-colors"
                      >
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!consoleError && !parsedTable && (
              <div className="h-full flex items-center justify-center text-slate-400">
                Click "Run Query" or pick a preset above to test.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-xl shadow-cyan-500/25 transition-all hover:scale-110 min-h-[48px] min-w-[48px] flex items-center justify-center cursor-pointer"
          title="Jump to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SQLCourseView;
