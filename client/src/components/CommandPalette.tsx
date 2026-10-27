import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Code2,
  Compass,
  BookOpen,
  Sparkles,
  GraduationCap,
  Timer,
  LayoutDashboard,
  Moon,
  Sun,
  Maximize2,
  Volume2,
  VolumeX,
  Shuffle,
  X,
  CornerDownLeft,
  FolderTree,
  Database,
  CheckCircle2
} from 'lucide-react';
import { QuestionSummary } from '../types';
import { LeetCodeTab } from './LeetCodeNavbar';
import { soundManager } from '../services/sound';
import sqlCourseData from '../assets/w3schools_sql_full_course.json';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionSummary[];
  onSelectQuestion: (questionId: string) => void;
  onSelectSQLTopic?: (topicId: string) => void;
  setActiveTab: (tab: LeetCodeTab) => void;
  onPickRandom: () => void;
  theme: 'dark' | 'oled' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'oled' | 'light' | 'system') => void;
  onToggleFullscreen: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

interface PaletteAction {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Theme';
  icon: React.ReactNode;
  shortcut?: string;
  perform: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  questions,
  onSelectQuestion,
  onSelectSQLTopic,
  setActiveTab,
  onPickRandom,
  theme,
  setTheme,
  onToggleFullscreen,
  isSoundEnabled,
  onToggleSound
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Base navigation and action items
  const baseActions: PaletteAction[] = [
    {
      id: 'tab-explore',
      title: 'Explore Overview & Featured Rows',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-[#FFA116]" />,
      perform: () => {
        setActiveTab('explore');
        onClose();
      }
    },
    {
      id: 'tab-dbms',
      title: 'DBMS & SQL Engineering Lab Arena (Triggers, Procedures, Normalization)',
      category: 'Navigation',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      perform: () => {
        setActiveTab('dbms');
        onClose();
      }
    },
    {
      id: 'tab-sql-course',
      title: 'W3Schools SQL Master Handbook (87 Topics & Lab Exam Syllabus)',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      perform: () => {
        setActiveTab('sql-course');
        onClose();
      }
    },
    {
      id: 'tab-problems',
      title: 'Problem Bank (All 150+ Coding Questions across 5 Banks)',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      perform: () => {
        setActiveTab('problems');
        onClose();
      }
    },
    {
      id: 'tab-topic-mode',
      title: 'Topic Mode: Problems Grouped & Sorted by Topic',
      category: 'Navigation',
      icon: <FolderTree className="w-4 h-4 text-amber-500" />,
      perform: () => {
        try { localStorage.setItem('arena_question_view_mode', 'topic'); } catch {}
        setActiveTab('problems');
        onClose();
      }
    },
    {
      id: 'tab-masterclass',
      title: 'Java Masterclass (18 Modules & 64 A-Z Methods)',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      perform: () => {
        setActiveTab('masterclass');
        onClose();
      }
    },
    {
      id: 'tab-curriculum',
      title: 'Curriculum & 27 Study Guides (from Documents)',
      category: 'Navigation',
      icon: <GraduationCap className="w-4 h-4 text-purple-400" />,
      perform: () => {
        setActiveTab('curriculum');
        onClose();
      }
    },
    {
      id: 'tab-exam',
      title: 'Contest / Timed Exam Simulator',
      category: 'Navigation',
      icon: <Timer className="w-4 h-4 text-rose-400" />,
      perform: () => {
        setActiveTab('exam');
        onClose();
      }
    },
    {
      id: 'tab-dashboard',
      title: 'Analytics Dashboard & Stats',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />,
      perform: () => {
        setActiveTab('dashboard');
        onClose();
      }
    },
    {
      id: 'act-random',
      title: 'Pick Random Problem to Practice',
      category: 'Actions',
      icon: <Shuffle className="w-4 h-4 text-amber-500" />,
      perform: () => {
        onPickRandom();
        onClose();
      }
    },
    {
      id: 'act-fullscreen',
      title: 'Toggle Absolute Fullscreen Mode',
      category: 'Actions',
      icon: <Maximize2 className="w-4 h-4 text-blue-400" />,
      shortcut: 'Alt+Enter',
      perform: () => {
        onToggleFullscreen();
        onClose();
      }
    },
    {
      id: 'act-sound',
      title: isSoundEnabled ? 'Mute Audio Sound Effects' : 'Enable Audio Sound Effects',
      category: 'Actions',
      icon: isSoundEnabled ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />,
      perform: () => {
        onToggleSound();
        onClose();
      }
    },
    {
      id: 'theme-oled',
      title: 'Switch to OLED Pitch-Black Mode (#000000)',
      category: 'Theme',
      icon: <span className="w-3.5 h-3.5 rounded-full bg-black border border-[#FFA116]" />,
      perform: () => {
        setTheme('oled');
        onClose();
      }
    },
    {
      id: 'theme-dark',
      title: 'Switch to Dark Charcoal Mode (#1a1a1a)',
      category: 'Theme',
      icon: <Moon className="w-4 h-4 text-neutral-400" />,
      perform: () => {
        setTheme('dark');
        onClose();
      }
    },
    {
      id: 'theme-light',
      title: 'Switch to Light Mode',
      category: 'Theme',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      perform: () => {
        setTheme('light');
        onClose();
      }
    }
  ];

  // Filter actions based on query
  const qLower = query.toLowerCase().trim();

  const filteredActions = qLower
    ? baseActions.filter((a) => a.title.toLowerCase().includes(qLower) || a.category.toLowerCase().includes(qLower))
    : baseActions;

  // Question search matches (across Java, C++, and SQL/DBMS banks)
  const filteredQuestions = qLower
    ? questions
        .filter(
          (q) =>
            q.title.toLowerCase().includes(qLower) ||
            q.id.toLowerCase().includes(qLower) ||
            q.topic.toLowerCase().includes(qLower) ||
            q.difficulty.toLowerCase().includes(qLower) ||
            (q.bank && q.bank.toLowerCase().includes(qLower))
        )
        .slice(0, 10)
    : [];

  // SQL Course & Viva topics matches (87 comprehensive topics)
  const filteredCourseTopics = qLower
    ? (sqlCourseData as Array<{ id: string; title: string; category: string; summary: string }>).filter(
        (t) =>
          t.title.toLowerCase().includes(qLower) ||
          t.category.toLowerCase().includes(qLower) ||
          (t.summary && t.summary.toLowerCase().includes(qLower)) ||
          t.id.toLowerCase().includes(qLower)
      ).slice(0, 8)
    : [];

  // When searching: Questions first, then SQL Topics, then Actions
  // When idle: Actions first
  const totalResults = qLower
    ? filteredQuestions.length + filteredCourseTopics.length + filteredActions.length
    : filteredActions.length;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalResults));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + Math.max(1, totalResults)) % Math.max(1, totalResults));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (qLower) {
          if (selectedIndex < filteredQuestions.length) {
            const q = filteredQuestions[selectedIndex];
            if (q) {
              onSelectQuestion(q.id);
              onClose();
            }
          } else if (selectedIndex < filteredQuestions.length + filteredCourseTopics.length) {
            const topicIndex = selectedIndex - filteredQuestions.length;
            const topic = filteredCourseTopics[topicIndex];
            if (topic) {
              if (onSelectSQLTopic) {
                onSelectSQLTopic(topic.id);
              } else {
                setActiveTab('sql-course');
              }
              onClose();
            }
          } else {
            const actionIndex = selectedIndex - (filteredQuestions.length + filteredCourseTopics.length);
            filteredActions[actionIndex]?.perform();
          }
        } else {
          filteredActions[selectedIndex]?.perform();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    selectedIndex,
    totalResults,
    qLower,
    filteredActions,
    filteredQuestions,
    filteredCourseTopics,
    onSelectQuestion,
    onSelectSQLTopic,
    setActiveTab,
    onClose
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 animate-in fade-in duration-150 [isolation:isolate]">
      <div
        className="relative w-full max-w-2xl bg-[#1e1e1e] border border-[#383838] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#eff1f6bf]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#333333] bg-[#252525]">
          <Search className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search questions, SQL topics, or commands (e.g. 'normalization', 'trigger', 'join', 'reverse')..."
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 font-sans"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#333333] text-neutral-400 ml-2">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[420px] overflow-y-auto p-2 space-y-2">
          {/* Question Matches Section */}
          {filteredQuestions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center justify-between">
                <span>Practice Questions ({filteredQuestions.length})</span>
                <span className="text-[10px] text-neutral-500 font-normal">Java • C++ • DBMS Lab</span>
              </div>
              {filteredQuestions.map((q, idx) => {
                const itemIndex = idx;
                const isSelected = selectedIndex === itemIndex;
                const diffColor =
                  q.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-950/60'
                    : q.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-950/60'
                    : 'text-rose-400 bg-rose-950/60';

                const isDBMS = q.bank === 'dbms' || q.id.startsWith('dbms-');

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onSelectQuestion(q.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FFA116] text-black font-semibold' : 'text-neutral-300 hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isDBMS ? (
                        <Database className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-black' : 'text-emerald-400'}`} />
                      ) : (
                        <Code2 className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-black' : 'text-blue-400'}`} />
                      )}
                      <span className="font-mono text-[11px] opacity-75">{q.id}</span>
                      <span className="truncate">{q.title}</span>
                      {q.solved && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {isDBMS && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${isSelected ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                          DBMS
                        </span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isSelected ? 'bg-black/20 text-black' : diffColor}`}>
                        {q.difficulty}
                      </span>
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* SQL Course & Viva Handbook Topics Section */}
          {filteredCourseTopics.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center justify-between">
                <span>SQL Guide & Viva Topics ({filteredCourseTopics.length})</span>
                <span className="text-[10px] text-cyan-500/80 font-normal">W3Schools & University Syllabus</span>
              </div>
              {filteredCourseTopics.map((topic, idx) => {
                const itemIndex = filteredQuestions.length + idx;
                const isSelected = selectedIndex === itemIndex;

                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      if (onSelectSQLTopic) {
                        onSelectSQLTopic(topic.id);
                      } else {
                        setActiveTab('sql-course');
                      }
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected ? 'bg-cyan-400 text-black font-semibold' : 'text-neutral-300 hover:bg-[#20293a]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <BookOpen className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-black' : 'text-cyan-400'}`} />
                      <span className="truncate">{topic.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isSelected ? 'bg-black/20 text-black' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'}`}>
                        {topic.category.replace(/^[0-9.]+\s*/, '')}
                      </span>
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Actions & Navigation Section */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                {qLower ? 'Commands & Tools' : 'Quick Actions & Pages'}
              </div>
              {filteredActions.map((action, idx) => {
                const itemIndex = qLower ? filteredQuestions.length + filteredCourseTopics.length + idx : idx;
                const isSelected = selectedIndex === itemIndex;

                return (
                  <button
                    key={action.id}
                    onClick={action.perform}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FFA116] text-black font-semibold' : 'text-neutral-300 hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{action.icon}</span>
                      <span>{action.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {action.shortcut && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-[#2e2e2e] text-neutral-400'}`}>
                          {action.shortcut}
                        </span>
                      )}
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-12 text-center text-sm text-neutral-400 space-y-2">
              <p>No matching questions, topics, or commands found for "{query}".</p>
              <p className="text-xs text-neutral-500">
                Try searching for <span className="text-cyan-400">"normalization"</span>, <span className="text-emerald-400">"triggers"</span>, <span className="text-amber-400">"procedures"</span>, or <span className="text-blue-400">"joins"</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#333333] bg-[#1a1a1a] text-[11px] text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="text-[#FFA116] font-bold">{questions.length}</span>
            <span>Problems</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">{sqlCourseData.length}</span>
            <span>SQL Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};
