import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  Table,
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

export const SQLCourseView: React.FC<SQLCourseViewProps> = ({
  initialJumpId,
  onNavigateToDBMS
}) => {
  const lessons: Lesson[] = useMemo(() => sqlCourseData as Lesson[], []);

  // Jump points search query
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id || 'sql_intro');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
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
  const [consoleQuery, setConsoleQuery] = useState('SELECT CustomerID, CustomerName, ContactName, City, Country FROM Customers LIMIT 5;');
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
    const element = document.getElementById(`sql-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update hash without jumping
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
    
    // Check if clicked anchor or child of button with data-try-sql or data-sql-jump
    const tryBtn = target.closest('[data-try-sql]');
    if (tryBtn) {
      e.preventDefault();
      // Find the nearest code block in the same example box
      const exampleBox = tryBtn.closest('.w3-example');
      if (exampleBox) {
        const codeEl = exampleBox.querySelector('.w3-code') || exampleBox.querySelector('code');
        if (codeEl) {
          const sqlText = codeEl.textContent || '';
          setConsoleQuery(sqlText.trim());
          setIsConsoleOpen(true);
          // Execute automatically
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
        setConsoleResult('Query executed successfully. (0 rows returned or DDL completed)');
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-neutral-200">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#2e2e2e] shadow-xs px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#383838] bg-slate-100 dark:bg-[#242424] hover:bg-slate-200 dark:hover:bg-[#2e2e2e] transition-colors"
              title="Toggle Jump Points Sidebar"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    W3Schools SQL Master Handbook
                  </h1>
                  <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Ad-Free • 77 Topics
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400 hidden md:block">
                  Complete single-page continuous curriculum with interactive live database runner
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-44 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Jump to topic (e.g. JOIN, WHERE)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-[#202020] border border-slate-200 dark:border-[#383838] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Launch Live SQL Console Button */}
            <button
              onClick={() => setIsConsoleOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isConsoleOpen ? 'Close Console' : 'SQL Console'}</span>
              <span className="sm:hidden">SQL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto flex gap-6 px-4 lg:px-8 py-6 items-start">
        {/* Sticky Table of Contents Sidebar */}
        {isSidebarOpen && (
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-slate-200 dark:border-[#2e2e2e] bg-white dark:bg-[#181818] p-3 shadow-xs scrollbar-thin">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-[#2e2e2e]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-neutral-200 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
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
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Toggle All
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {filteredCategories.map(([categoryName, catLessons]) => {
                const isCollapsed = !!collapsedCategories[categoryName];
                return (
                  <div key={categoryName} className="space-y-1">
                    <button
                      onClick={() => toggleCategory(categoryName)}
                      className="w-full flex items-center justify-between py-1 px-1.5 text-left font-semibold text-slate-700 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400 rounded transition-colors group"
                    >
                      <span className="truncate pr-1">{categoryName}</span>
                      <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-emerald-500">
                        <span className="text-[10px] px-1 rounded bg-slate-100 dark:bg-[#252525]">
                          {catLessons.length}
                        </span>
                        {isCollapsed ? (
                          <ChevronRight className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="pl-2 border-l border-slate-200 dark:border-[#2e2e2e] space-y-0.5 ml-1">
                        {catLessons.map(lesson => {
                          const isActive = activeLessonId === lesson.id;
                          const isBookmarked = bookmarkedIds.has(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => jumpToLesson(lesson.id)}
                              className={`w-full flex items-center justify-between text-left px-2 py-1 rounded text-[11px] transition-colors ${
                                isActive
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500'
                                  : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <span className="truncate">{lesson.navText}</span>
                              {isBookmarked && (
                                <BookmarkCheck className="w-3 h-3 text-amber-500 shrink-0 ml-1" />
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
        <main className="flex-1 min-w-0 space-y-8" onClick={handleContentClick}>
          {/* Welcome Banner */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Continuous Ad-Free Course
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  SQL A-Z: The Complete Interactive Curriculum
                </h2>
                <p className="text-sm text-slate-600 dark:text-neutral-300 mt-1 max-w-2xl">
                  Scroll continuously through all 77 W3Schools lessons. Use the sticky jump points to navigate instantly. Run and experiment with any SQL query in the interactive sandbox below.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConsoleOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-2 transition-transform hover:scale-[1.02]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Try Sample SQL</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sequential 77 Lessons */}
          {lessons.map((lesson, idx) => {
            const isBookmarked = bookmarkedIds.has(lesson.id);
            return (
              <section
                key={lesson.id}
                id={`sql-${lesson.id}`}
                className="scroll-mt-24 rounded-2xl border border-slate-200 dark:border-[#2e2e2e] bg-white dark:bg-[#181818] shadow-xs overflow-hidden transition-all hover:border-slate-300 dark:hover:border-[#383838]"
              >
                {/* Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-3.5 bg-slate-50/80 dark:bg-[#1e1e1e]/80 border-b border-slate-200 dark:border-[#2e2e2e]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                      {lesson.order}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-[#282828] text-slate-700 dark:text-neutral-300 border border-slate-300/50 dark:border-[#3a3a3a]">
                      {lesson.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {lesson.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Link to this section */}
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}${window.location.pathname}#sql-course/${lesson.id}`;
                        handleCopy(url, `link-${lesson.id}`);
                      }}
                      className="px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#282828] text-slate-600 dark:text-neutral-400 transition-colors flex items-center gap-1"
                      title="Copy Jump Link"
                    >
                      {copiedId === `link-${lesson.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">Copied Link</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Share Link</span>
                        </>
                      )}
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleBookmark(lesson.id)}
                      className={`p-1.5 rounded border transition-colors ${
                        isBookmarked
                          ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                          : 'border-slate-200 dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#282828] text-slate-400'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Section'}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Lesson Educational Content Body */}
                <div className="p-5 sm:p-7 w3-sql-prose">
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.rawHtml }}
                    className="leading-relaxed"
                  />
                </div>

                {/* Section Quick Action Footer */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-3 bg-slate-50/50 dark:bg-[#141414] border-t border-slate-100 dark:border-[#222222] text-xs text-slate-500">
                  <span className="font-mono text-[11px]">Anchor: #sql-{lesson.id}</span>
                  <div className="flex items-center gap-3">
                    {idx < lessons.length - 1 && (
                      <button
                        onClick={() => jumpToLesson(lessons[idx + 1].id)}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Next: {lessons[idx + 1].navText}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </main>
      </div>

      {/* Floating Interactive SQL Console Drawer */}
      {isConsoleOpen && (
        <div className="fixed bottom-0 right-0 z-50 w-full md:w-[600px] lg:w-[680px] h-[500px] max-h-[85vh] bg-white dark:bg-[#1a1a1a] border-t md:border-l border-slate-200 dark:border-[#333] shadow-2xl rounded-t-2xl md:rounded-tl-2xl flex flex-col transition-all animate-in slide-in-from-bottom duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-[#2e2e2e] bg-slate-50 dark:bg-[#202020] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Live SQLite Sandbox (Northwind Database)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setConsoleQuery('SELECT CustomerID, CustomerName, ContactName, City, Country FROM Customers LIMIT 5;');
                  executeSQL('SELECT CustomerID, CustomerName, ContactName, City, Country FROM Customers LIMIT 5;');
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-[#2e2e2e] hover:bg-slate-300 dark:hover:bg-[#383838] transition-colors"
                title="Reset sample query"
              >
                Reset
              </button>
              <button
                onClick={() => setIsConsoleOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Editor Area */}
          <div className="p-3 bg-[#181818] border-b border-[#2e2e2e]">
            <textarea
              value={consoleQuery}
              onChange={e => setConsoleQuery(e.target.value)}
              placeholder="Type your SQL statement here (e.g. SELECT * FROM Customers;)"
              className="w-full h-24 p-2.5 font-mono text-xs bg-[#121212] border border-[#333] rounded-lg text-emerald-400 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-400">
                Preloaded tables: <code className="text-amber-400">Customers, Orders, Products, Shippers, Categories, Employees</code>
              </span>
              <button
                onClick={() => executeSQL()}
                disabled={consoleLoading}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {consoleLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Run Query</span>
              </button>
            </div>
          </div>

          {/* Drawer Results View */}
          <div className="flex-1 p-3 overflow-auto bg-slate-50 dark:bg-[#141414] text-xs font-mono">
            {consoleError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">SQL Execution Error:</div>
                  <pre className="mt-1 whitespace-pre-wrap">{consoleError}</pre>
                </div>
              </div>
            )}

            {!consoleError && parsedTable && (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-[#2e2e2e]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-200/80 dark:bg-[#222222] text-slate-800 dark:text-neutral-200">
                      {parsedTable.headers.map((h, i) => (
                        <th key={i} className="p-2 border-b border-slate-300 dark:border-[#333] font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTable.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b border-slate-200 dark:border-[#242424] hover:bg-slate-100 dark:hover:bg-[#1a1a1a]"
                      >
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="p-2 text-slate-700 dark:text-neutral-300">
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
                Click "Run Query" to see output results.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl transition-all hover:scale-110"
          title="Jump to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SQLCourseView;
